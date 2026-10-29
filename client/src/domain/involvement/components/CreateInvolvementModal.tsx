import { useRef } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';

import { createInvolvement } from '../api/create-involvement.service';
import { useInvolvementsContext } from '../Involvements.context';
import { InvolvementFields, type Values } from './InvolvementFields';

export function CreateInvolvementModal() {
    const sending = useRef(false);

    const {
        record,
        availablePeople,
        isLoading,
        error,
        isLoadingPeople,
        peopleError,
        isSending,
        setIsSending,
        setIsCreateModalVisible,
        fetchInvolvements,
        fetchPeople,
    } = useInvolvementsContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => {
        if (sending.current) return;

        form.resetFields();
        setIsCreateModalVisible(false);
    };

    const onFinish = async (values: Values) => {
        if (sending.current || isSending || isLoading || error !== null || isLoadingPeople || peopleError !== null) return;

        if (!availablePeople.some(p => p.id === values.person_id)) {
            form.setFields([{ name: 'person_id', errors: ['Selecione uma pessoa disponível para este relato.'] }]);
            return;
        }

        sending.current = true;
        setIsSending(true);

        const response = await createInvolvement(record.id, values);

        sending.current = false;
        setIsSending(false);

        if (hasServiceError(response)) {
            if (!(response instanceof Error) && response.statusCode === 409) {
                form.setFields([{ name: 'person_id', errors: ['Pessoa já vinculada a este relato.'] }]);
                fetchInvolvements();
                fetchPeople();
                return;
            }

            if (!(response instanceof Error) && response.statusCode === 404) {
                handleServiceError(app, response, () => 'Pessoa ou relato não encontrado. Os dados serão atualizados.');
                fetchInvolvements();
                fetchPeople();
                return;
            }

            return handleServiceError(app, response instanceof Error
                ? new Error('Não foi possível comunicar com a API. Tente novamente.')
                : response, response => response.statusCode === 422
                ? 'Confira a pessoa e o tipo de envolvimento informados.'
                : 'Não foi possível vincular a pessoa. Tente novamente.');
        }

        if (response.statusCode !== 201 || !response.data?.involvement?.id)
            return handleServiceError(app, new Error('Não foi possível vincular a pessoa. Tente novamente.'));

        close();
        app.message.success('Pessoa vinculada com sucesso.');
        fetchInvolvements();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Vincular pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Vincular"
            onCancel={close}
            cancelText="Cancelar"
            okButtonProps={{ disabled: isLoading || error !== null || isLoadingPeople || peopleError !== null || availablePeople.length === 0 }}
            cancelButtonProps={{ disabled: isSending }}
            closable={!isSending}
            maskClosable={!isSending}
            keyboard={!isSending}
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="createInvolvement"
                layout="vertical"
                autoComplete="off"
                disabled={isSending}
            >
                <InvolvementFields />
            </Form>
        </Modal>
    );
}
