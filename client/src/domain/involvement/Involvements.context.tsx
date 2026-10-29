import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { App } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { UnknownContextError } from '@domain/@shared/unknown-context-error';
import { listPeople } from '@domain/person/api/list-people.service';
import type { Person } from '@domain/person/person.type';
import type { Record } from '@domain/record/record.type';
import { useRecordsContext } from '@domain/record/Records.context';

import { listInvolvements } from './api/list-involvements.service';
import type { Involvement } from './involvement.type';

type Value = {
    record: Record.Model;
    involvements: Involvement.ListedModel[];
    people: Person.Model[];
    availablePeople: Person.Model[];
    isAnonymous: boolean | null;
    isLoading: boolean;
    error: string | null;
    isLoadingPeople: boolean;
    peopleError: string | null;
    isSending: boolean;
    setIsSending: Dispatch<SetStateAction<Value['isSending']>>;
    isCreateModalVisible: boolean;
    setIsCreateModalVisible: Dispatch<SetStateAction<Value['isCreateModalVisible']>>;
    fetchInvolvements: () => Promise<void>;
    fetchPeople: () => Promise<void>;
    close: () => void;
};

type Props = {
    record: Record.Model;
    children: (value: Value) => ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const InvolvementsContext = createContext<Value | null>(null);

export function InvolvementsContextProvider({ record, children }: Props) {
    const [involvements, setInvolvements] = useState<Value['involvements']>([]);
    const [people, setPeople] = useState<Value['people']>([]);
    const [isAnonymous, setIsAnonymous] = useState<Value['isAnonymous']>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Value['error']>(null);
    const [isLoadingPeople, setIsLoadingPeople] = useState(true);
    const [peopleError, setPeopleError] = useState<Value['peopleError']>(null);
    const [isSending, setIsSending] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const mounted = useRef(false);
    const involvementsRequest = useRef(0);
    const peopleRequest = useRef(0);

    const { setIsInvolvementsModalVisible, setRecordId, fetchRecords } = useRecordsContext();

    const app = App.useApp();
    const recordId = record.id;

    const close = useCallback(() => {
        setIsInvolvementsModalVisible(false);
        setRecordId(null);
    }, [setIsInvolvementsModalVisible, setRecordId]);

    const fetchInvolvements = useCallback(async () => {
        if (!mounted.current) return;

        const requestId = ++involvementsRequest.current;

        setIsLoading(true);
        setIsAnonymous(null);
        setError(null);

        const response = await listInvolvements(recordId);

        if (!mounted.current || requestId !== involvementsRequest.current) return;

        setIsLoading(false);

        if (hasServiceError(response)) {
            if (!(response instanceof Error) && response.statusCode === 404) {
                handleServiceError(app, response, () => 'Relato não encontrado. A lista será atualizada.');
                close();
                fetchRecords();
                return;
            }

            setError('Não foi possível atualizar os envolvidos. Tente novamente.');
            return;
        }

        if (response.statusCode !== 200 || !Array.isArray(response.data?.involvements) || typeof response.data?.is_anonymous !== 'boolean') {
            setError('Não foi possível atualizar os envolvidos. Tente novamente.');
            return;
        }

        setInvolvements(response.data.involvements);
        setIsAnonymous(response.data.is_anonymous);
    }, [app, close, fetchRecords, recordId]);

    const fetchPeople = useCallback(async () => {
        if (!mounted.current) return;

        const requestId = ++peopleRequest.current;

        setIsLoadingPeople(true);
        setPeopleError(null);

        const response = await listPeople();

        if (!mounted.current || requestId !== peopleRequest.current) return;

        setIsLoadingPeople(false);

        if (hasServiceError(response)) {
            setPeopleError('Não foi possível carregar as pessoas. Tente novamente.');
            return;
        }

        if (response.statusCode !== 200 || !Array.isArray(response.data?.people)) {
            setPeopleError('Não foi possível carregar as pessoas. Tente novamente.');
            return;
        }

        setPeople(response.data.people);
    }, []);

    useEffect(() => {
        mounted.current = true;
        fetchInvolvements();
        fetchPeople();

        return () => {
            mounted.current = false;
        };
    }, [fetchInvolvements, fetchPeople]);

    const availablePeople = useMemo(() => {
        return people.filter(p => !involvements.some(i => i.person_id === p.id));
    }, [people, involvements]);

    const value: Value = {
        record,
        involvements,
        people,
        availablePeople,
        isAnonymous,
        isLoading,
        error,
        isLoadingPeople,
        peopleError,
        isSending,
        setIsSending,
        isCreateModalVisible,
        setIsCreateModalVisible,
        fetchInvolvements,
        fetchPeople,
        close,
    };

    return (
        <InvolvementsContext.Provider value={value}>
            {children(value)}
        </InvolvementsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInvolvementsContext() {
    const context = useContext(InvolvementsContext);

    if (!context)
        throw new UnknownContextError();

    return context;
}
