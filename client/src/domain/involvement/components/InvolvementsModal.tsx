import { Fragment } from 'react';

import { Alert, Button, Divider, Modal, Row, type TableColumnsType, Tag, Typography } from 'antd';

import { Show } from '@domain/@shared/Show';
import { Table } from '@domain/@shared/Table';
import type { Record } from '@domain/record/record.type';

import type { Involvement } from '../involvement.type';
import { InvolvementsContextProvider } from '../Involvements.context';
import { CreateInvolvementModal } from './CreateInvolvementModal';
import { InvolvementsActionsCell } from './InvolvementsActionsCell';

const TYPE_LABELS: Record<Involvement.Type, string> = {
    whistleblower: 'Relatante',
    witness: 'Testemunha',
    victim: 'Vítima',
    denounced: 'Denunciado',
};

const COLUMNS: TableColumnsType<Involvement.ListedModel> = [
    {
        title: 'Nome',
        render: (_, involvement) => involvement.person?.name ?? 'Pessoa indisponível',
    },
    {
        title: 'CPF',
        render: (_, involvement) => involvement.person?.cpf ?? '—',
    },
    {
        title: 'E-mail',
        render: (_, involvement) => involvement.person?.email ?? '—',
    },
    {
        title: 'Envolvimento',
        dataIndex: 'type',
        render: value => TYPE_LABELS[value as Involvement.Type] ?? value,
    },
    {
        render: (_, involvement) => <InvolvementsActionsCell involvement={involvement} />,
    },
];

type Props = { record: Record.Model };

export function InvolvementsModal({ record }: Props) {
    return (
        <InvolvementsContextProvider record={record}>
            {({
                involvements,
                isAnonymous,
                isLoading,
                error,
                isSending,
                isCreateModalVisible,
                setIsCreateModalVisible,
                fetchInvolvements,
                close,
            }) => (
                <Fragment>
                    <Modal
                        open
                        title={`Envolvidos — Relato #${record.id}`}
                        width={900}
                        footer={null}
                        onCancel={() => {
                            if (!isSending && !isCreateModalVisible) close();
                        }}
                        closable={!isSending && !isCreateModalVisible}
                        maskClosable={!isSending && !isCreateModalVisible}
                        keyboard={!isSending && !isCreateModalVisible}
                    >
                        <Divider />

                        <Typography.Paragraph>{record.title}</Typography.Paragraph>

                        <Row justify="space-between" align="middle" gutter={[8, 8]}>
                            <Show when={!isLoading && error === null && isAnonymous !== null}>
                                <Tag color={isAnonymous ? 'default' : 'blue'}>
                                    {isAnonymous ? 'Anônimo' : 'Identificado'}
                                </Tag>
                            </Show>

                            <Button
                                type="primary"
                                disabled={isLoading || error !== null || isSending || isCreateModalVisible}
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Vincular pessoa
                            </Button>
                        </Row>

                        <Divider />

                        <Show when={error !== null}>
                            <Alert
                                type="error"
                                showIcon
                                message={error}
                                action={(
                                    <Button onClick={fetchInvolvements} loading={isLoading}>
                                        Tentar novamente
                                    </Button>
                                )}
                            />
                        </Show>

                        <Show when={error === null}>
                            <Table
                                columns={COLUMNS}
                                dataSource={involvements}
                                loading={isLoading}
                                scroll={{ x: 700 }}
                            />
                        </Show>
                    </Modal>

                    <Show when={isCreateModalVisible}>
                        <CreateInvolvementModal />
                    </Show>
                </Fragment>
            )}
        </InvolvementsContextProvider>
    );
}
