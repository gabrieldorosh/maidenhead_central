'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';

import useRegisterModal from '../../hooks/useRegisterModal';
import { error } from 'console';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/auth/register', data)
            .then(() => {
                registerModal.onClose();
            })
            .catch((error) => {
                toast.error("An error occurred. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading 
                title="Welcome to Maidenhead Central"
                subtitle="Create an account!"
                // center // Deciding if this looks better centered or not
            />
            <Input 
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button 
                outline
                label="Sign up with Google"
                icon={FcGoogle}
                onClick={() => {}}
            />
            <Button 
                outline
                label="Sign up with GitHub"
                icon={AiFillGithub}
                onClick={() => {}}
            />
            <div
                className="
                    text-neutral-500
                    text-center
                    mt-4
                    font-light
                "
            >
                <div 
                    className="
                        justify-center 
                        flex 
                        flex-row 
                        items-center 
                        gap-2
                    "
                >
                    <div>
                        Already have an account?
                    </div>
                    <div 
                        onClick={registerModal.onClose}
                        className="
                            text-neutral-800 
                            cursor-pointer 
                            hover:underline
                        "
                    >
                        Log In
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Next"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal;