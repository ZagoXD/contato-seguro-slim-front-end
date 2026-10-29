import { useRef, useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import dayjs from 'dayjs';

import { updatePerson } from '../api/update-person.service';
import { usePeopleContext } from '../People.context';
import { PersonFields, type Values } from './PersonFields';

export function EditPersonModal() {
    const [isSending, setIsSending] = useState(false);
    const sending = useRef(false);

    const {
        person,
        setIsEditModalVisible,
        setPersonId,
        fetchPeople,
    } = usePeopleContext();

    const app = App.useApp();

    const [form] = Form.useForm<Values>();

    if (!person)
        return null;

    const close = () => {
        if (sending.current) return;

        form.resetFields();
        setIsEditModalVisible(false);
        setPersonId(null);
    };

    const onFinish = async (values: Values) => {
        if (sending.current) return;

        sending.current = true;
        setIsSending(true);

        const response = await updatePerson(person.id, {
            ...values,
            name: values.name.trim(),
            birth_date: values.birth_date.format('YYYY-MM-DD'),
        });

        sending.current = false;
        setIsSending(false);

        if (hasServiceError(response)) {
            if (!(response instanceof Error) && response.statusCode === 409) {
                form.setFields([{ name: 'cpf', errors: ['CPF já cadastrado.'] }]);
                return;
            }

            if (!(response instanceof Error) && response.statusCode === 404) {
                handleServiceError(app, response, () => 'Pessoa não encontrada. A lista será atualizada.');
                close();
                fetchPeople();
                return;
            }

            return handleServiceError(app, response instanceof Error
                ? new Error('Não foi possível conectar à API. Tente novamente.')
                : response, response => response.statusCode === 422
                ? 'Confira os dados informados e tente novamente.'
                : 'Não foi possível editar a pessoa. Tente novamente.');
        }

        close();
        app.message.success('Pessoa atualizada com sucesso.');
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Editar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Confirmar"
            onCancel={close}
            cancelText="Cancelar"
            cancelButtonProps={{ disabled: isSending }}
            closable={!isSending}
            maskClosable={!isSending}
            keyboard={!isSending}
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="editPerson"
                layout="vertical"
                autoComplete="off"
                initialValues={{ ...person, birth_date: dayjs(person.birth_date) }}
                disabled={isSending}
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}
