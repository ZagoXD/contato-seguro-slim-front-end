import { useRef, useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';

import { createPerson } from '../api/create-person.service';
import { usePeopleContext } from '../People.context';
import { PersonFields, type Values } from './PersonFields';

export function CreatePersonModal() {
    const [isSending, setIsSending] = useState(false);
    const sending = useRef(false);

    const { setIsCreateModalVisible, fetchPeople } = usePeopleContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => {
        if (sending.current) return;

        form.resetFields();
        setIsCreateModalVisible(false);
    };

    const onFinish = async (values: Values) => {
        if (sending.current) return;

        sending.current = true;
        setIsSending(true);

        const response = await createPerson({
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

            return handleServiceError(app, response instanceof Error
                ? new Error('Não foi possível conectar à API. Tente novamente.')
                : response, response => response.statusCode === 422
                ? 'Confira os dados informados e tente novamente.'
                : 'Não foi possível cadastrar a pessoa. Tente novamente.');
        }

        close();
        app.message.success('Pessoa cadastrada com sucesso.');
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Cadastrar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Cadastrar"
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
                name="createPerson"
                layout="vertical"
                autoComplete="off"
                disabled={isSending}
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}
