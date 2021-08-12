import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import { DialogModal } from "../../ui/Modal";
import Field from "../../ui/Field";

export default function ModalDeleteAccount({
  setModal,
}: {
  setModal: Dispatch<SetStateAction<string>>;
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
        <button className="btn-danger btn-block mla ">
          Confirmer la suppression
        </button>
      </div>
    </DialogModal>
  );
}
