import { IonContent, IonPage } from '@ionic/react';
import './UserName.css';
import { useState } from 'react';
import { useHistory } from 'react-router';

const UserName: React.FC = () => {
    const [name, setName] = useState<string>('');
    const navigate = useHistory();
    const handleFinish = () => {
        // TODO Validar que el nombre exista
        // TODO Validar la longintud del nombre
        localStorage.setItem("name", name);
        navigate.push("/loadingScreen")
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="background-woman flex flex-col items-center justify-center min-h-screen">
                    {/* Puntos superiores */}
                    <img
                        src="./step6.svg"
                        alt="Progress dots"
                        className="dots1 absolute top-20"
                    />
                    {/* Texto principal */}
                    <div className="text-container flex flex-col items-center mt-12 px-16 pb-8 pt-6">
                        <p className="text-normal">
                            What’s your <span className="text-highlight">name?</span>
                        </p>
                    </div>
                    {/* Input para el nombre */}
                    <div className="input-container pt-8 pb-8">
                        <input
                            type="text"
                            className="name-input"
                            placeholder="Your name here ..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Botones de opciones */}
                    <div className="action-container flex gap-4 mt-8 pb-8">
                        <button
                            className="next-button mt-2 rounded-full"
                            onClick={() => handleFinish()}
                        >
                            Finish
                        </button>
                    </div>
                    {/* Texto de nota */}
                    <div className="note-container-topics mt-8 text-center px-20">
                        <p className="text-note">
                            * Your name will appear with your daily quotes for a personalized experience.
                        </p>
                    </div>

                </div>
            </IonContent>
        </IonPage >
    );
};

export default UserName;
