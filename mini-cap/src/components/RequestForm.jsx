import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { submitRequest } from "../backend/RequestHandler";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/RequestForm.css";
import { getCondo } from "../backend/PropertyHandler";

/**
 * Represents a form component for submitting requests related to a condo.
 * Receives properties to handle close action and condo information.
 * Manages state for subject, description, submitting status, and active notifications.
 * Checks for active notifications periodically and updates state accordingly.
 * Handles form submission by sending a request with subject and description.
 * @param {Function} handleClickClose - Function to handle closing the request form.
 * @param {Object} condoInfo - Object containing condo information like property name and unit number.
 * @returns {JSX.Element} The rendered RequestForm component.
 */
const RequestForm = ({ handleClickClose, condoInfo }) => {
  const [subject, setSubject] = useState("none");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState([]);
  const { propertyName, unitNumber,id } = condoInfo;

  /**
   * Checks for active notifications periodically and updates the notificationsActive state accordingly.
   * If there are active notifications, sets notificationsActive state to true, otherwise sets it to false.
   * Executes once when the component mounts and then at intervals of 1000 milliseconds.
   * Clears the interval when the component is unmounted to avoid memory leaks.
   * @returns {void}
   */
  useEffect(() => {
    const checkNotifications = () => {
      const activeNotifications = [];

      if (activeNotifications.length > 0) {
        setNotificationsActive(true);
      } else {
        setNotificationsActive(false);
      }
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Handles the form submission event.
   * Prevents the default form submission behavior.
   * Sets the submitting state to true.
   * Validates whether subject and description fields are filled.
   * Displays an error toast if any field is empty.
   * Retrieves condo information based on the condoID.
   * Submits the request with the condoID, subject, and description.
   * Displays a success toast if the request is submitted successfully.
   * Clears the subject and description fields and sets the submitting state back to false.
   * @param {Event} e - The form submission event object.
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!subject || !description) {
        toast.error("Please fill all fields");
        return;
      }
      const condo = await getCondo(id);
      const requestID = await submitRequest(id, subject, description);
      toast.success("Request submitted successfully", {
        onClose: handleClickClose,
      });
      handleClickClose();
      console.log("The request was submitted successfully");
    } catch (error) {
      toast.error("Request failed to submit for unexpected reasons");
      console.error(error);
    } finally {
      setSubject("none");
      setDescription("");
      setSubmitting(false); // Set submitting state back to false
    }
  };

  return (
    <div className="Requestcontainer">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="titleform">Submit Request</h2>
        <br></br>
        <h3 className="Requesttitle">
          {" "}
          {propertyName}: {unitNumber}{" "}
        </h3>
        <label className="dropdown" htmlFor="dropdown">
          Subject:
        </label>
        <select
          id="dropdown"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="Moving Request">Moving Request</option>
          <option value="Access Request">Request Access</option>
          <option value="Violation Report">Report Violation</option>
          <option value="General Question">General Question</option>
          <option value="Damage Report">Report Damage in Common Area</option>
          <option value="Maintenance Request">Request Maintenance</option>
          <option value="Payment Invoice">Payment Invoice</option>
          <option value="Fee Inquiry">Fee Inquiries</option>
          <option value="Insurance">Insurance Coverage Details</option>
          <option value="Taxes">Tax Letter by Mail</option>
        </select>
        <label
          className="dropdown"
          htmlFor="description"
          style={{ paddingTop: "6%" }}
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter request description here..."
          style={{ marginBottom: "5%" }}
        ></textarea>
        <button
          type="button"
          className="cancel-button"
          onClick={handleClickClose}
          disabled={notificationsActive}
        >
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

RequestForm.propTypes = {
  handleClickClose: PropTypes.func.isRequired,
};

export default RequestForm;
