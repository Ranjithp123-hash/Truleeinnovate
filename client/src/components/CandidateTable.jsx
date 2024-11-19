import React, { useEffect, useState } from "react";
import {
  Button,
  InputGroup,
  FormControl,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { LuFilter } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import axios from "axios";

import AddCandidate from "./AddCandidateForm";
import UpdateCandidateForm from './UpdateCandidate';
import api from "../services/api";


const CandidateTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: "",
    minExperience: "",
    maxExperience: "",
    skill: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);


  const recordsPerPage = 10;

  useEffect(() => {
    handleCandidates();
  }, []);




  const totalPages = Math.ceil(filteredCandidates.length / recordsPerPage);


  const currentRecords = filteredCandidates.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );


  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };




  const handleCandidates = async () => {
    try {
      const response = await axios.get(`${api}/getcandidates`);
      setCandidates(response.data);
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      alert("Failed to fetch candidates. Please try again later.");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(term.toLowerCase()) ||
        candidate.email.toLowerCase().includes(term.toLowerCase()) ||
        candidate.phone.includes(term)
    );
    setFilteredCandidates(filtered);
  };


  const DeleteCandidate = async (id) => {
    try {
      await axios.post(`${api}/deletecandidate`, { id });
      handleCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Failed to delete candidate. Please try again later.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const { gender, minExperience, maxExperience, skill } = filters;

    const filtered = candidates.filter((candidate) => {
      const matchesGender = gender
        ? candidate.gender.toLowerCase() === gender.toLowerCase()
        : true;

      const matchesExperience =
        (minExperience === "" || candidate.experience >= Number(minExperience)) &&
        (maxExperience === "" || candidate.experience <= Number(maxExperience));

      const matchesSkill = skill
        ? candidate.skills
          .toLowerCase()
          .includes(skill.toLowerCase().trim())
        : true;

      return matchesGender && matchesExperience && matchesSkill;
    });

    setFilteredCandidates(filtered);
  };

  const resetFilters = () => {
    setFilters({
      gender: "",
      minExperience: "",
      maxExperience: "",
      skill: "",
    });
    setFilteredCandidates(candidates);
  };

  const addCandidateToList = (newCandidate) => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.phone) {
      alert("Please provide complete candidate details.");
      return;
    }
    setCandidates((prevCandidates) => [...prevCandidates, newCandidate]);
    setFilteredCandidates((prevCandidates) => [...prevCandidates, newCandidate]);
  };

  const handleUpdateCandidate = async (updatedCandidate) => {
    try {
      await axios.put(`${api}/updatecandidate`, updatedCandidate);
      setShowUpdateModal(false);
      handleCandidates();
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate. Please try again.");
    }
  };

  return (
    <div>
      <div className="d-flex  justify-content-between align-items-center mb-3">
        <h4>Candidates</h4>
        <Button onClick={() => setShowModal(true)} variant="primary">
          Add
        </Button>
      </div>

      <InputGroup
        className=" d-flex align-items-center justify-content-center flex-wrap mb-4"

      >

        <div className="d-flex justify-content-between align-items-center "
          style={{ width: "100%" }}
        >


          <div
            className="input-group col-12 col-sm-8 col-md-6 col-lg-5 "
            style={{ maxWidth: "40%", maxHeight: "40px" }}
          >
            <span className="input-group-text bg-white border-end-0 text-primary ">
              <BiSearch />
            </span>
            <FormControl
              placeholder="Search by Candidate, Email, Phone"
              aria-label="Search"
              className="border-start-0 "
              onChange={(e) => handleSearch(e.target.value)}
              value={searchTerm}
              style={{ maxWidth: "60%" }}
            />

          </div>


          <div className="d-flex align-items-center  justify-content-center ms-3"
            style={{ maxHeight: "40px" }}
          >
            <div className="filter-wrapper" style={{ position: "relative", maxHeight: "40px" }}>
              <Button variant="dark" onClick={prevPage} disabled={currentPage === 1}>
                &lt;
              </Button>
              <span className="ms-1 me-1">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="dark"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
            </div>


            <div className="d-flex align-items-center ms-3">
              <Button
                variant=""
                onClick={() => setShowFilter(!showFilter)}
                className="me-2 text-primary border"
              >
                <LuFilter />
              </Button>

              {showFilter && (
                <div
                  className="filter-card p-3 border bg-light"
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    width: "300px",
                    zIndex: 1000,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={() => setShowFilter(true)}
                  onMouseLeave={() => setShowFilter(false)}
                >
                  <h5>Filter</h5>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter gender"
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Experience (years)</Form.Label>
                      <Row>
                        <Col>
                          <Form.Control
                            type="number"
                            placeholder="Min"
                            name="minExperience"
                            value={filters.minExperience}
                            onChange={handleFilterChange}
                          />
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            placeholder="Max"
                            name="maxExperience"
                            value={filters.maxExperience}
                            onChange={handleFilterChange}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Skill/Technology</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter skill"
                        name="skill"
                        value={filters.skill}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <Button variant="secondary" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button variant="primary" onClick={applyFilters}>
                        Apply
                      </Button>
                    </div>
                  </Form>
                </div>
              )}



            </div>
          </div>
        </div>
      </InputGroup>



      <div className="d-flex align-items-center  flex-wrap" style={{ maxWidth: "100%" }}>

        <table className="table">
          <thead className="table-primary">
            <tr>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Current Experience</th>
              <th>Skills/Technology</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.gender}</td>
                <td>{candidate.experience}</td>
                <td>{candidate.skills}</td>
                <td className="d-flex align-items-center justify-content-center">


                  <div
                    className="text-warning p-1 m-1 text-center"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowUpdateModal(true);
                    }}
                  >
                    <HiOutlinePencil />
                  </div>

                  <span className="text-info">/</span>

                  <div
                    className="text-danger pl-1 pr-1 m-1 text-center "
                    onClick={() => DeleteCandidate(candidate.id)}
                  >
                    <MdDeleteOutline />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>



      </div>

      <AddCandidate
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddCandidate={addCandidateToList}
      />



      {selectedCandidate && (
        <UpdateCandidateForm
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          candidate={selectedCandidate}
          onUpdate={handleUpdateCandidate}
        />
      )}


    </div>
  );
};

export default CandidateTable;
