import React, { SyntheticEvent, useEffect, useState } from "react";
import { Modal } from "../../ui/Modal";
import { useDashboardContext } from "../../contexts/DashboardContext";
import { FileTextStatus } from "../../ui/Utils";

export default function ModalScanFileEdit() {
  const { setModal, selectedScan, selectedFile, updateFile } =
    useDashboardContext();

  const [fields, setFields] = useState({
    category: selectedFile.category ? selectedFile.category : "",
    orientation: selectedFile.orientation ? selectedFile.orientation : "",
    status: selectedFile.status ? selectedFile.status : "",
    position: selectedFile.position ? selectedFile.position : "",
  });

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setFields({ ...fields, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    Object.assign(fields, { status: Number(fields.status) });
    try {
      await updateFile(selectedFile, fields);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      title={<FileTextStatus status={selectedFile.status} />}
      onClose={setModal}
    >
      <div className="grid2">
        <div className="stack pt3">
          <img
            src={
              process.env.PUBLIC_URL +
              `/media/uploads/scans/${selectedScan.user.username}/${selectedFile.current_filename}`
            }
            alt={selectedFile.current_filename}
          />
        </div>
        <div className="stack px3">
          <div className="form-group">
            <div className="form-group">
              <label htmlFor="status">Catégorie</label>
              <select id="category" name="category" onChange={handleChange}>
                {fields.category === "" ? (
                  <option>Choisir une catégorie</option>
                ) : (
                  <option>{fields.category}</option>
                )}
                <option value="La paire">La paire</option>
                <option value="La boite">La boite</option>
                <option value="Documents et accessoires">
                  Documents et accessoires
                </option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="status">Orientation</label>
            <select id="orientation" name="orientation" onChange={handleChange}>
              {fields.orientation === "" ? (
                <option>Choisir une orientation</option>
              ) : (
                <option>{fields.orientation}</option>
              )}
              <option value="Coté droit">Coté droit</option>
              <option value="Coté gauche">Coté gauche</option>
              <option value="Devant">Devant</option>
              <option value="Au dessus">Au dessus</option>
              <option value="Derrière">Derrière</option>
              <option value="En dessous">En dessous</option>
              <option value="Coté droit">Coté tag</option>
              <option value="Coté gauche">Intérieur</option>
              <option value="Devant">Facture</option>
              <option value="Au dessus">Lacets</option>
              <option value="Derrière">Tags</option>
            </select>
          </div>
          <div className="grid2">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <input
                name="status"
                id="status"
                type="text"
                value={fields.status}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                name="position"
                id="position"
                type="text"
                value={fields.position}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-actions text-right">
            <button
              className="btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
