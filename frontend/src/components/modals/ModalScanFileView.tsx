import React from "react";
import { Modal } from "../../ui/Modal";
import { useDashboardContext } from "../../contexts/DashboardContext";
import { FileTextStatus } from "../../ui/Utils";

export default function ModalScanFileView() {
  const { setModal, selectedScan, selectedFile } = useDashboardContext();
  return (
    <Modal
      title={<FileTextStatus status={selectedFile.status} />}
      onClose={setModal}
    >
      <div className="grid2">
        <div className="stack pt3">
          <img
            src={`/src/images/uploads/scans/${selectedScan.user.username}/${selectedFile.current_filename}`}
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
                value={selectedFile.category}
                readOnly
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="orientation">Orientation</label>
            <input
              name="orientation"
              id="orientation"
              type="text"
              value={selectedFile.orientation}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              name="status"
              id="status"
              type="text"
              value={selectedFile.status}
              readOnly
            />
          </div>
          <div className="form-actions text-right"></div>
        </div>
      </div>
    </Modal>
  );
}
