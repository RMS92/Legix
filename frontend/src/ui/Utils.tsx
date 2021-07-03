import React from "react";

export function ScanStatus({ status }: { status: number }) {
  return status === 0 ? (
    <div className="text-danger">Fausse</div>
  ) : status === 1 ? (
    <div className="text-info">En attente</div>
  ) : status === 2 ? (
    <div className="text-success">Authentique</div>
  ) : status === 3 ? (
    <div className="text-info">Douteuse</div>
  ) : null;
}

export function ScanBadgeStatus({ status }: { status: number }) {
  return status === 0 ? (
    <div className="badge badge-danger">Fausse</div>
  ) : status === 1 ? (
    <div className="badge badge-info">En attente</div>
  ) : status === 2 ? (
    <div className="badge badge-success">Authentique</div>
  ) : status === 3 ? (
    <div className="badge badge-info">Douteuse</div>
  ) : null;
}

export function ScanTextStatus({ status }: { status: number }) {
  return status === 0 ? (
    <div className="text-danger">La paire est fausse</div>
  ) : status === 1 ? (
    <div className="text-info">En attente de validation</div>
  ) : status === 2 ? (
    <div className="text-success">La paire est Authentique</div>
  ) : status === 3 ? (
    <div className="text-info">La paire est douteuse</div>
  ) : null;
}

export function FileTextStatus({ status }: { status: number }) {
  return status === 0 ? (
    <div className="text-danger">La photo nous semble fausse</div>
  ) : status === 1 ? (
    <div className="text-info">En attente de validation</div>
  ) : status === 2 ? (
    <div className="text-success">La photo nous semble authentique</div>
  ) : status === 3 ? (
    <div className="text-info">La photo nous semble douteuse</div>
  ) : null;
}
