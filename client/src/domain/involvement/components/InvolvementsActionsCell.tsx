import { useRef, useState } from 'react';

import { App, Button, Popconfirm } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { handleServiceError } from '@domain/@shared/service.helper';

import { deleteInvolvement } from '../api/delete-involvement.service';
import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';

type Props = { involvement: Involvement.ListedModel };

export function InvolvementsActionsCell({ involvement }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const sending = useRef(false);

    const { record, isSending, setIsSending, isLoading, error, fetchInvolvements, fetchPeople } = useInvolvementsContext();

    const app = App.useApp();

    const handleDelete = async () => {
        if (sending.current || isSending || isLoading || error !== null) return;

        sending.current = true;
        setIsSending(true);

        const response = await deleteInvolvement(record.id, involvement.id);

        sending.current = false;
        setIsSending(false);

        if (response instanceof Error || 'error' in response) {
            if (!(response instanceof Error) && response.statusCode === 404) {
                handleServiceError(app, response, () => 'Vínculo ou relato não encontrado. A lista será atualizada.');
                setIsPopconfirmVisible(false);
                fetchInvolvements();
                fetchPeople();
                return;
            }

            return handleServiceError(app, response instanceof Error
                ? new Error('Não foi possível comunicar com a API. Tente novamente.')
                : response, () => 'Não foi possível remover o vínculo. Tente novamente.');
        }

        if (response.statusCode !== 200)
            return handleServiceError(app, new Error('Não foi possível remover o vínculo. Tente novamente.'));

        setIsPopconfirmVisible(false);
        app.message.success('Vínculo removido com sucesso.');
        fetchInvolvements();
        fetchPeople();
    };

    return (
        <Popconfirm
            title="Remover vínculo"
            description="Tem certeza que deseja remover o vínculo com este relato?"
            open={isPopconfirmVisible}
            placement="left"
            cancelText="Não"
            okText="Sim"
            okType="danger"
            okButtonProps={{ loading: isSending }}
            cancelButtonProps={{ disabled: isSending }}
            onConfirm={handleDelete}
            onCancel={() => {
                if (!isSending) setIsPopconfirmVisible(false);
            }}
        >
            <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Remover vínculo"
                aria-label="Remover vínculo"
                disabled={isSending || isLoading || error !== null}
                onClick={() => setIsPopconfirmVisible(true)}
            />
        </Popconfirm>
    );
}
