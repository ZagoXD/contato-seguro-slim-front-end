import { Fragment } from 'react';

import { Alert, Button, Form, Select } from 'antd';

import { Show } from '@domain/@shared/Show';

import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';

const TYPE_OPTIONS: { label: string; value: Involvement.Type }[] = [
    { label: 'Relatante', value: 'whistleblower' },
    { label: 'Testemunha', value: 'witness' },
    { label: 'Vítima', value: 'victim' },
    { label: 'Denunciado', value: 'denounced' },
];

export type Values = Pick<Involvement.Model, 'person_id' | 'type'>;

export function InvolvementFields() {
    const { people, availablePeople, isLoadingPeople, peopleError, isSending, fetchPeople } = useInvolvementsContext();

    return (
        <Fragment>
            <Show when={peopleError !== null}>
                <Alert
                    type="error"
                    showIcon
                    message={peopleError}
                    action={(
                        <Button onClick={fetchPeople} loading={isLoadingPeople}>
                            Tentar novamente
                        </Button>
                    )}
                />
            </Show>

            <Show when={!isLoadingPeople && peopleError === null && availablePeople.length === 0}>
                <Alert
                    type="info"
                    showIcon
                    message={people.length === 0
                        ? 'Não há pessoas cadastradas. Cadastre uma pessoa na tela de Pessoas.'
                        : 'Todas as pessoas disponíveis já estão vinculadas. Cadastre outra pessoa na tela de Pessoas.'}
                />
            </Show>

            <Form.Item<Values>
                name="person_id"
                label="Pessoa"
                rules={[{ required: true, message: 'Por favor, selecione uma pessoa.' }]}
            >
                <Select
                    options={people.map(p => ({
                        label: `${p.name} — ${p.cpf}`,
                        value: p.id,
                        disabled: !availablePeople.some(a => a.id === p.id),
                    }))}
                    placeholder="Selecione uma pessoa"
                    showSearch
                    loading={isLoadingPeople}
                    disabled={isSending || isLoadingPeople || peopleError !== null}
                    filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Form.Item<Values>
                name="type"
                label="Tipo de envolvimento"
                rules={[{ required: true, message: 'Por favor, selecione um tipo de envolvimento.' }]}
            >
                <Select options={TYPE_OPTIONS} placeholder="Selecione um tipo" />
            </Form.Item>
        </Fragment>
    );
}
