import React, { useContext } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserContext } from '../context/UserContext.jsx';

export default function LoginScreen() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    return (
        <div className="flex items-center justify-center mt-14">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    onSubmit={async (values) => {
                        try {
                            const response = await fetch('http://localhost:3002/api/auth/login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: values.email,
                                    password: values.password
                                })
                            });

                            if (response.ok) {
                                const data = await response.json();
                                login(data.user, data.token);
                                navigate('/', { replace: true });
                            } else {
                                console.log('Erreur lors de la connexion', response.json());
                            }
                        } catch (error) {
                            console.log(error.message);
                        }
                    }}
                    validationSchema={Yup.object({
                        email: Yup.string().email('Adresse email invalide').required('Email requis'),
                        password: Yup.string().required('Mot de passe requis')
                    })}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                                <Field
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                                    type="email"
                                    name="email"
                                    placeholder="Entrez votre email"
                                />
                                <ErrorMessage name="email" component="div" className="text-sm text-red-600 mt-1" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe:</label>
                                <Field
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                                    type="password"
                                    name="password"
                                    placeholder="Entrez votre mot de passe"
                                />
                                <ErrorMessage name="password" component="div" className="text-sm text-red-600 mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 font-bold text-white bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    {isSubmitting ? 'Connexion...' : 'Se connecter'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}