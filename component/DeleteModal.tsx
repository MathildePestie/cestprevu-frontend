'use client';
import { FC } from 'react';
import styles from './DeleteModal.module.css';

type ModalProps = {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
};

const DeleteModal: FC<ModalProps> = ({ show, onConfirm, onCancel, title }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h4 className={styles.modalTitle}>Supprimer la liste</h4>
        <p className={styles.modalText}>Es-tu sûr(e) de vouloir supprimer {title ? `"${title}"` : "cette liste"} ?</p>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={onConfirm}>Oui, supprimer</button>
          <button className={styles.button2}  onClick={onCancel}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;