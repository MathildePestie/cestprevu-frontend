'use client';
import { useState, FC, useEffect } from 'react';
import styles from './EditProfileModal.module.css';

type Props = {
  show: boolean;
  onClose: () => void;
  user: {
    username: string;
    email: string;
    phone: string;
    token: string;
  };
  onUpdate: (newUser: { username: string; email: string; phone: string }) => void;
};

const EditProfileModal: FC<Props> = ({ show, onClose, user, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
    setPhone(user.phone);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('https://cestprevu-backend.onrender.com/users/update', {

      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, username, email, phone }),
    });

    const data = await response.json();
    if (data.result) {
      onUpdate({ username, email, phone });
      onClose();
    } else {
      alert('Erreur lors de la mise à jour.');
    }
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h4 className={styles.title}>Modifier mes informations</h4>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom" required />
          <input className="form-control mb-3" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
          <input className="form-control mb-3" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Téléphone" required />
          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className={styles.button}>Enregistrer</button>
            <button type="button" className={styles.button2} onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;