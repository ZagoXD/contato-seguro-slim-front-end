import { Fragment } from 'react';

import { Alert, Button, Row, type TableColumnsType, Typography } from 'antd';

import { Show } from '@domain/@shared/Show';
import { Table } from '@domain/@shared/Table';
import { CreatePersonModal } from '@domain/person/components/CreatePersonModal';
import { EditPersonModal } from '@domain/person/components/EditPersonModal';
import { PeopleActionsCell } from '@domain/person/components/PeopleActionsCell';
import { PeopleContextProvider } from '@domain/person/People.context';
import type { Person } from '@domain/person/person.type';
import dayjs from 'dayjs';

const COLUMNS: TableColumnsType<Person.Model> = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: value => `#${value}`,
    },
    {
        title: 'Nome',
        dataIndex: 'name',
    },
    {
        title: 'CPF',
        dataIndex: 'cpf',
    },
    {
        title: 'E-mail',
        dataIndex: 'email',
    },
    {
        title: 'Nascimento',
        dataIndex: 'birth_date',
        render: value => dayjs(value).format('DD/MM/YYYY'),
    },
    {
        render: (_, record) => <PeopleActionsCell person={record} />,
    },
];

export function People() {
    return (
        <PeopleContextProvider>
            {({
                isLoading,
                error,
                people,
                person,
                fetchPeople,
                setIsCreateModalVisible,
                isCreateModalVisible,
                isEditModalVisible,
            }) => (
                <Fragment>
                    <main>
                        <Row justify="space-between" align="middle">
                            <Typography.Title level={3}>
                                Pessoas
                            </Typography.Title>

                            <Button
                                type="primary"
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Cadastrar pessoa
                            </Button>
                        </Row>

                        <Show when={error !== null}>
                            <Alert
                                type="error"
                                showIcon
                                message={error}
                                action={(
                                    <Button onClick={fetchPeople} loading={isLoading}>
                                        Tentar novamente
                                    </Button>
                                )}
                            />
                        </Show>

                        <Show when={error === null}>
                            <Table
                                columns={COLUMNS}
                                dataSource={people}
                                loading={isLoading}
                                scroll={{ x: 800 }}
                            />
                        </Show>
                    </main>

                    <Show when={isCreateModalVisible}>
                        <CreatePersonModal />
                    </Show>

                    <Show when={isEditModalVisible && person !== null}>
                        <EditPersonModal />
                    </Show>
                </Fragment>
            )}
        </PeopleContextProvider>
    );
}
