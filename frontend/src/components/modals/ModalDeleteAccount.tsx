import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import { DialogModal } from "../../ui/Modal";
import Field from "../../ui/Field";
import { apiFetch } from "../../utils/api";
import { FlashMessage, User } from "../../types";

export default function ModalDeleteAccount({
  user,
  setModal,
  setFlashMessages,
}: {
  user: User;
  setModal: Dispatch<SetStateAction<string>>;
  setFlashMessages: Dispatch<SetStateAction<FlashMessage>>;
}) {
  const [fields, setFields] = useState({
    password: "",
  });

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setFields({ ...fields, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await apiFetch("/users/" + user._id + "/profil", {
        method: "delete",
        body: JSON.stringify(fields),
      });
      setFlashMessages(res);
    } catch (err) {
      setFlashMessages(err);
    }
  };

  return (
    <DialogModal onClose={setModal} padding={5} style={{}} className={""}>
      <div className="stack stack-medium">
        <h1 className="h1">Confirmer la supression</h1>
        <p className="small text-muted">
          Vous êtes sur le point de supprimer votre compte Legix.
          <br />
          Pour confirmer cette demande merci de rentrer votre mot de passe. Le
          compte sera automatiquement supprimé dans les minutes à venir.
        </p>
        <div className="form-group">
          <Field
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Entrez votre mot de passe pour confirmer"
            value={fields.password}
          />
        </div>
        <button className="btn-danger btn-block mla" onClick={handleSubmit}>
          Confirmer la suppression
        </button>
      </div>
    </DialogModal>
  );
}
