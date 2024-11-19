import React, { useState, } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import api from "../services/api";

const AddCandidate = ({ show, onClose, onAddCandidate }) => {
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    experience: "",
    skills: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({
      ...newCandidate,
      [name]: value,
    });
  };

  const handleAddCandidate = async () => {
    if (
      newCandidate.name &&
      newCandidate.email &&
      newCandidate.phone &&
      newCandidate.gender &&
      newCandidate.experience &&
      newCandidate.skills
    ) {
      try {
        const response = await axios.post(
          // 'http://localhost:4000/addcandidates',
          `${api}/addcandidates`,
          newCandidate
        );
        console.log("ereww", response.data.status);


        if (response.data.status === 200) {
          const addedCandidate = response.data;
          setNewCandidate({
            name: "",
            email: "",
            phone: "",
            gender: "",
            experience: "",
            skills: "",
          });
          window.location.href = "/";
          onClose();

        } else {
          alert("Failed to add candidate. Please check your input or try again.");
        }
      } catch (error) {
        console.error("Error adding candidate:", error);
        alert("Failed to add candidate. Please try again later.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Candidate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Candidate Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newCandidate.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newCandidate.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={newCandidate.phone}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={newCandidate.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Experience (Years)</Form.Label>
            <Form.Control
              type="number"
              name="experience"
              value={newCandidate.experience}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skills/Technology</Form.Label>
            <Form.Control
              type="text"
              name="skills"
              value={newCandidate.skills}
              onChange={handleInputChange}
              placeholder="Comma-separated skills, e.g., JavaScript, React"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddCandidate}>
          Add Candidate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCandidate;
