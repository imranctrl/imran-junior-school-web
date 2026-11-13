

const admissionsForm = document.getElementById("admissionsForm");
const admissionSuccess = document.getElementById("admissionSuccess");

if (admissionsForm && admissionSuccess) {
    Object.values(admissionsForm.elements).forEach(field => {
        if (typeof field.setCustomValidity !== "function") return;

        field.addEventListener("input", () => field.setCustomValidity(""));
        field.addEventListener("change", () => field.setCustomValidity(""));
    });

    admissionsForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!admissionsForm.reportValidity()) return;

        const fields = {
            pupil_name: admissionsForm.elements.namedItem("pupil_name"),
            dob: admissionsForm.elements.namedItem("dob"),
            class_grade: admissionsForm.elements.namedItem("class_grade"),
            program_type: admissionsForm.elements.namedItem("program_type"),
            parent_name: admissionsForm.elements.namedItem("parent_name"),
            phone: admissionsForm.elements.namedItem("phone"),
            email: admissionsForm.elements.namedItem("email"),
            notes: admissionsForm.elements.namedItem("notes")
        };

        const value = name => fields[name]?.value.trim() ?? "";

        const checks = [
            [fields.pupil_name, value("pupil_name").length >= 2, "Pupil's name is too short."],
            [fields.pupil_name, value("pupil_name").length <= 80, "Pupil's name is too long."],
            [fields.parent_name, value("parent_name").length >= 2, "Parent's name is too short."],
            [fields.parent_name, value("parent_name").length <= 80, "Parent's name is too long."],
            [fields.phone, value("phone").length >= 7, "Phone number is too short."],
            [fields.phone, value("phone").length <= 20, "Phone number is too long."],
            [fields.notes, value("notes").length <= 1000, "Additional notes cannot exceed 1,000 characters."]
        ];

        const failedCheck = checks.find(([, passed]) => !passed);

        if (failedCheck) {
            const [field, , message] = failedCheck;
            field.setCustomValidity(message);
            field.reportValidity();
            return;
        }

        const endpoint = admissionsForm.action;

        if (!endpoint || new URL(endpoint).hostname !== "formspree.io") {
            alert("The admissions form is not connected to its Formspree endpoint yet.");
            return;
        }

        const submitButton = admissionsForm.querySelector('[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const formResponse = await fetch(endpoint, {
                method: "POST",
                body: new FormData(admissionsForm),
                headers: { Accept: "application/json" }
            });

            if (!formResponse.ok) {
                throw new Error(`Formspree returned HTTP ${formResponse.status}`);
            }

            admissionsForm.reset();
            admissionsForm.style.display = "none";
            admissionSuccess.style.display = "block";
        } catch (error) {
            console.error("Admissions submission failed:", error);
            alert("Unable to submit your application. Please check your connection and try again.");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}
