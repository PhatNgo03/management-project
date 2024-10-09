/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

const ModalReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userId, setUserId] = useState("");
    const hasMounted = useHasMounted();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (userEmail) {
            form.setFieldValue("email", userEmail);
        }
    }, [userEmail])

    if (!hasMounted) return <></>

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: "POST",
            body: {
                email
            }
        })
        if (res?.data) {
            setUserId(res?.data._id)
            setCurrent(1)
        }
        else {
            notification.error({
                message: "Call APIs Error",
                description: res?.error
            })
        }
    }
    const onFinishStep1 = async (values: any) => {
        const { code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: "POST",
            body: {
                code, _id: userId
            }
        })
        if (res?.data) {
            setCurrent(2)
        }
        else {
            notification.error({
                message: "Call APIs Error",
                description: res?.error
            })
        }
    }
    return (
        <>
            <Modal title="Kích hoạt tài khoản"
                open={isModalOpen}
                onOk={() => setIsModalOpen(true)}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Login',
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },

                        {
                            title: 'Done',
                            // status: 'finish',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 &&
                    <>
                        <div style={{ margin: "20px 0" }}>
                            Tài khoản của bạn chưa được kích hoạt
                        </div>
                        <Form
                            name="verify"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                            form={form}

                        >
                            <Form.Item
                                label=""
                                name="email"
                            >
                                <Input disabled value={userEmail} />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Resent
                                </Button>
                            </Form.Item>
                        </Form>

                    </>

                }
                {current === 1 &&
                    <>
                        <div style={{ margin: "20px 0" }}>
                            Vui lòng nhập mã xác nhận
                        </div>
                        <Form
                            name="verify2"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout='vertical'
                            form={form}

                        >
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Active
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }
                {current === 2 &&
                    <div style={{ margin: "20px 0" }}>
                        Tài khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập lại!
                    </div>
                }
            </Modal >
        </>
    )
}

export default ModalReactive;