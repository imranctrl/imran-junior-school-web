// ======================================
// ADMISSIONS APPLICATION HANDLER
// ======================================

const admissionsForm = document.getElementById("admissionsForm");

const admissionSuccess = document.getElementById("admissionSuccess");


if (admissionsForm && admissionSuccess) {

    // Clear previous validation messages when fields change

    Object.values(admissionsForm.elements).forEach(field => {

        if (typeof field.setCustomValidity === "function") {

            field.addEventListener("input", () => {
                field.setCustomValidity("");
            });

            field.addEventListener("change", () => {
                field.setCustomValidity("");
            });

        }

    });


    admissionsForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const formData = new FormData(admissionsForm);

        const applicationData = Object.fromEntries(formData.entries());


        try {

            const serverResponse = await fetch("/api/applications", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(applicationData)

            });


            const result = await serverResponse.json();


            // HANDLE VALIDATION ERRORS

            if (!serverResponse.ok) {

                let firstInvalidField = null;

                result.errors?.forEach(issue => {

                    const fieldName = issue.path[0];

                    const field = admissionsForm.elements.namedItem(fieldName);

                    if (field && typeof field.setCustomValidity === "function") {

                        field.setCustomValidity(issue.message);

                        if (!firstInvalidField) {
                            firstInvalidField = field;
                        }

                    }

                });

                if (firstInvalidField) {

                    firstInvalidField.reportValidity();

                } else {

                    alert(result.message || "Application submission failed.");

                }

                return;

            }


            // SUCCESSFUL SUBMISSION

            admissionsForm.reset();

            admissionsForm.style.display = "none";

            admissionSuccess.style.display = "block";


        } catch (error) {

            alert("Unable to submit your application. Please try again.");

        }

    });

}