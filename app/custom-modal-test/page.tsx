"use client";
import { useState } from "react";
import { Button } from "@mantine/core";
import CustomUnauthorizedModal from "@/components/modal/CustomUnauthorizedModal";

export default function CustomModalTest() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Modal Test</h1>

      <div className="space-y-4">
        <p>
          This page tests the custom unauthorized modal without using Mantine's
          Modal component.
        </p>

        <Button onClick={() => setShowModal(true)} color="red" size="lg">
          Show Custom Unauthorized Modal
        </Button>

        <div className="mt-4 p-4 border border-gray-300 rounded">
          <p>
            <strong>Modal State:</strong> {showModal ? "OPEN" : "CLOSED"}
          </p>
        </div>
      </div>

      {/* Our custom modal component */}
      <CustomUnauthorizedModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
