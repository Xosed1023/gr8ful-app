import { IonContent, IonPage } from "@ionic/react";
import "./Languages.css";
import { useHistory } from "react-router";

const Languages: React.FC = () => {
    const navigate = useHistory();
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="background flex flex-col items-center justify-center min-h-screen">
                    {/* Puntos superiores */}
                    <img src="./step1.svg" alt="Progress dots" className="dots1 absolute top-20" />

                    {/* Idiomas */}
                    <div className="buttons-container flex flex-col items-center gap-8 mt-16">
                        <button
                            className="language-button"
                            onClick={() => navigate.push("/es")}
                        >
                            Español
                        </button>
                        <button
                            className="language-button"
                            onClick={() => navigate.push("/home")}
                        >
                            English
                        </button>
                        <button
                            className="language-button"
                            onClick={() => navigate.push("/fr")}
                        >
                            Français
                        </button>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Languages;
