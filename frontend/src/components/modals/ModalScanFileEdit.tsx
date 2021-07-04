import React, { SyntheticEvent, useState } from "react";
import { Modal } from "../../ui/Modal";
import { useDashboardContext } from "../../contexts/DashboardContext";
import { FileTextStatus } from "../../ui/Utils";

export default function ModalScanFileEdit() {
  const { setModal, selectedScan, fetchScan, selectedFile, updateFile } =
    useDashboardContext();

  const [fields, setFields] = useState({
    category: selectedFile.category ? selectedFile.category : "",
    orientation: selectedFile.orientation ? selectedFile.orientation : "",
    status: selectedFile.status ? selectedFile.status : "",
    order: "",
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
              <label htmlFor="category">Catégorie</label>
              <input
                name="category"
                id="category"
                type="text"
                value={fields.category}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="orientation">Orientation</label>
            <input
              name="orientation"
              id="orientation"
              type="text"
              value={fields.orientation}
              onChange={handleChange}
            />
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
              <label htmlFor="order">Position</label>
              <input
                name="order"
                id="order"
                type="text"
                value={fields.order}
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
