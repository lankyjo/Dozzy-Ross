"use client";
import { useState, useEffect } from "react";
import { Button, Modal, Text } from "@mantine/core";

// Remove the unused import since it doesn't exist
// import UnauthorizedModal from "@/components/modal/UnauthorizedModal";

export default function ModalTestPage() {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

  // Automatically show modals for testing
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auto-showing test modal");
      setShowBasicModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Modal Test Page</h1>

      <div className="space-y-4 mb-8">
        <Button onClick={() => setShowBasicModal(true)}>
          Open Basic Modal
        </Button>

        <Button onClick={() => setShowUnauthorizedModal(true)} color="red">
          Open Unauthorized Modal
        </Button>
      </div>

      {/* Basic test modal */}
      <Modal
        opened={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Test Modal"
        centered
      >
        <Text>This is a basic test modal to check if modals are working.</Text>
        <Button onClick={() => setShowBasicModal(false)} mt="md" fullWidth>
          Close
        </Button>
      </Modal>

      {/* Create simple unauthorized modal instead of using the missing component */}
      <Modal
        opened={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        title="Unauthorized Access"
        centered
      >
        <Text>You are not authorized to perform this action.</Text>
        <Text size="sm" mt="xs" c="dimmed">
          Please log in or contact an administrator for assistance.
        </Text>
        <Button
          onClick={() => setShowUnauthorizedModal(false)}
          mt="md"
          fullWidth
          color="red"
        >
          Close
        </Button>
      </Modal>

      {/* Debug info */}
      <div className="mt-8 p-4 border border-gray-300 rounded">
        <h2 className="text-xl font-bold mb-2">Debug Info</h2>
        <p>Basic Modal State: {showBasicModal ? "OPEN" : "CLOSED"}</p>
        <p>
          Unauthorized Modal State: {showUnauthorizedModal ? "OPEN" : "CLOSED"}
        </p>
      </div>
    </div>
  );
}
