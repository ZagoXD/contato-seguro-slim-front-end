import { useRef, useState } from 'react';

import { App, Button, Popconfirm, Space } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { handleServiceError } from '@domain/@shared/service.helper';

import { deletePerson } from '../api/delete-person.service';
import { usePeopleContext } from '../People.context';
import type { Person } from '../person.type';

type Props = { person: Person.Model };

export function PeopleActionsCell({ person }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const sending = useRef(false);

    const { setPersonId, setIsEditModalVisible, fetchPeople } = usePeopleContext();

    const app = App.useApp();

    const handleEdit = () => {
        setPersonId(person.id);
        setIsEditModalVisible(true);
    };

    const handleDelete = async () => {
        if (sending.current) return;

        sending.current = true;
        setIsSending(true);

        const response = await deletePerson(person.id);

        sending.current = false;
        setIsSending(false);

        if (response instanceof Error || 'error' in response) {
            if (!(response instanceof Error) && response.statusCode === 404) {
                handleServiceError(app, response, () => 'Pessoa não encontrada. A lista será atualizada.');
                setIsPopconfirmVisible(false);
                setIsEditModalVisible(false);
                setPersonId(null);
                fetchPeople();
                return;
            }

            return handleServiceError(app, response instanceof Error
                ? new Error('Não foi possível conectar à API. Tente novamente.')
                : response, () => 'Não foi possível excluir a pessoa. Tente novamente.');
        }

        if (response.statusCode !== 200)
            return handleServiceError(app, new Error('Não foi possível excluir a pessoa. Tente novamente.'));

        setIsPopconfirmVisible(false);
        setIsEditModalVisible(false);
        setPersonId(null);
        app.message.success('Pessoa excluída com sucesso.');
        fetchPeople();
    };

    return (
        <Space size="middle">
            <Button
                type="text"
                icon={<EditOutlined />}
                title="Editar"
                aria-label="Editar pessoa"
                disabled={isSending}
                onClick={handleEdit}
            />

            <Popconfirm
                title="Excluir pessoa"
                description="Tem certeza que deseja excluir a pessoa?"
                open={isPopconfirmVisible}
                placement="left"
                cancelText="Não"
                okText="Sim"
                okType="danger"
                okButtonProps={{ loading: isSending }}
                cancelButtonProps={{ disabled: isSending }}
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!sending.current) setIsPopconfirmVisible(false);
                }}
            >
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    title="Excluir"
                    aria-label="Excluir pessoa"
                    disabled={isSending}
                    onClick={() => setIsPopconfirmVisible(true)}
                />
            </Popconfirm>
        </Space>
    );
}
