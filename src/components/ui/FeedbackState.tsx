"use client";

import { useId, useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface FeedbackStateProps {
  title: string;
  description: string;
  variant: "loading" | "error" | "empty" | "success";
  actionLabel?: string;
  closeLabel?: string;
  show?: boolean;
  onAction?: () => void;
  onClose?: () => void;
}

export function FeedbackState({
  title,
  description,
  variant,
  actionLabel,
  closeLabel = "Fechar",
  show,
  onAction,
  onClose
}: FeedbackStateProps) {
  const [isOpen, setIsOpen] = useState(true);
  const titleId = useId();
  const isLoading = variant === "loading";
  const visible = show ?? isOpen;

  function handleClose() {
    if (isLoading) {
      return;
    }

    if (show === undefined) {
      setIsOpen(false);
    }

    onClose?.();
  }

  function handleAction() {
    onAction?.();
    handleClose();
  }

  return (
    <Modal
      show={visible}
      onHide={handleClose}
      centered
      backdrop={isLoading ? "static" : true}
      keyboard={!isLoading}
      dialogClassName={`feedback-dialog feedback-${variant}`}
      aria-labelledby={titleId}
    >
      <Modal.Header closeButton={!isLoading}>
        <div className="feedback-heading">
          <div className="feedback-icon" aria-hidden="true" />
          <Modal.Title id={titleId}>{title}</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      {!isLoading ? (
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            {closeLabel}
          </Button>
          {actionLabel ? (
            <Button className="starter-button" onClick={handleAction}>
              {actionLabel}
            </Button>
          ) : null}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}
