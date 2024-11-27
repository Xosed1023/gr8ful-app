import { IonContent, IonPage } from '@ionic/react';
import './Welcome.css';
import Logo from '../../public/logo.svg';

const Welcome: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="background flex flex-col items-center justify-center min-h-screen">
                    {/* Logo */}
                    <img src={Logo} alt="Gr8ful Logo" className="logo" />

                    {/* Descripción */}
                    <p className="description text-center mb-6 pb-8">
                        Discover daily inspiration and gratitude quotes to brighten your day!
                    </p>

                    {/* Botón */}
                    <button className="continue-button px-10 py-2 text-white rounded-full">
                        Continue
                    </button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Welcome;
