import React from "react";
import styles from "./RegularLogin.module.css";

const RegularLogin: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <div className={styles.container}>
            <div className={styles.subContainer}>
                <div className={styles.formContainer}>
                    <form>
                        <input placeholder="Username" />

                        <input placeholder="Password" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegularLogin;
