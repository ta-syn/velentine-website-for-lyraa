import React, { useState } from 'react';
import Modal from './Modal';
import AnimatedInput from './AnimatedInput';
import CyberButton from './CyberButton';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';
import { FaLock, FaTrash } from 'react-icons/fa';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  actionLabel?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Security Check",
  actionLabel = "Delete"
}) => {
  const { playSfx } = useSound();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password === 'y121l') {
      playSfx(SoundType.SUCCESS);
      onSuccess();
      setPassword('');
      setError('');
      onClose();
    } else {
      playSfx(SoundType.ERROR);
      setError('ACCESS_DENIED: Invalid security key');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center mb-6">
        <FaLock className="text-[#FF0080] text-3xl mx-auto mb-4 animate-pulse" />
        <h2 className="font-orbitron text-xl font-bold text-white uppercase">{title}</h2>
        <p className="font-rajdhani text-gray-400 text-sm mt-2">Enter admin password to proceed</p>
      </div>

      <div className="space-y-6">
        <AnimatedInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          placeholder="Enter password..."
          error={error}
          autoFocus
          icon={<FaLock className="text-[#FF0080]/50" />}
        />

        <div className="flex justify-end gap-4 pt-2">
          <CyberButton variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </CyberButton>
          <CyberButton variant="pink" size="sm" onClick={handleSubmit} icon={<FaTrash />}>
            {actionLabel}
          </CyberButton>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordModal;
