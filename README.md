# NoteX - The Healthcare Note Enhancer
Optimization of Clinical Note Entry through Speech Recognition and Dynamic Data Augmentation.

Developed as part of Georgia Tech Master's Program for CS-6440 - Introduction to Healthcare Informatics.
* [Proposal & Initial Design](https://github.com/dotnetpowered/NoteX/blob/main/docs/NoteX%20-%20Proposal.pdf)
* [User Manual](https://github.com/dotnetpowered/NoteX/blob/main/docs/NoteX%20-%20User%20Manual.pdf)
* [Launching Application via SMART on FHIR](https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r4&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=https%3A%2F%2Fdotnetpowered.github.io%2FNoteX%2Flaunch&patient=494743a2-fea5-4827-8f02-c2b91e4a4c9e&prov_skip_auth=1&prov_skip_login=1&provider=37881086-7b05-4b18-a279-08e331f50e9b&pt_skip_auth=1&pt_skip_login=0&public_key=&sb=&sde=&sim_ehr=0&token_lifetime=15&user_pt=494743a2-fea5-4827-8f02-c2b91e4a4c9e)

###	PROBLEM
In 2008, less than half (42%) of office-based physicians had adopted electronic health records (EHRs) of any kind. (Office-based Physician Electronic Health Record Adoption, n.d.)  With the advent of the HITECH act, the usage has more than doubled to nearly 86% in 2017.  On the surface this would seem like a positive trend, but physicians are not as pleased with the transition.  In a 2018 survey con-ducted by The Doctors Company, 61% of providers said their EHR systems re-duced efficiency and productivity. (The Future of Healthcare: A National Survey of Physicians - 2018, n.d.) 

For modernization of the provider office to truly meet its intended goals, the nega-tive impact of EHRs on physicians’ productivity and job satisfaction must be ad-dressed. The problems with EHRs continue to impede the industry and have been recognized by the United States’ Federal Government.  On February 21, 2020, The Office of the National Coordinator Health Information Technology released a report titled “Strategy on Reducing Regulatory and Administrative Burdens Relating to the Use of Health IT and EHRs.” (Mason, 2020)  The report echoes the problems stat-ed by providers in the 2018 survey mentioned earlier:

> “As EHR adoption has increased in health care settings, so too have con-cerns about the user experience. The user experience is often closely related to the usability of a health IT product. Poor usability can be a significant contributor to clinician burden.” (Strategy on Reducing Burden Relating to the Use of Health IT and EHRs, n.d.)

One of the major goals of the report is to “Reduce the effort and time required to record information in EHRs for health care providers during care delivery.”  The report further states “clinical documentation tasks in EHRs present another major challenge to clinician workflow.”

###	SOLUTION
The NoteX application gives the physician or other healthcare provider an EHR ag-nostic interface to add clinical notes through a speech to text conversion process.  The resulting text is further enhanced by dynamically looking up data in the EHR using keywords from the provider’s notes and inserting the results into the text.  Once the enhanced notes have been reviewed by the provider, they can be saved directly into the EHR through the NoteX application.

This solution aligns with recommendation #2 from the ONC on optimizing clinical documentation in the previously mentioned Strategy Report. (Strategy on Reducing Burden Relating to the Use of Health IT and EHRs, n.d.)  The strategy recommends “leverag[ing] data already present in the EHR to reduce redocumentation in the clin-ical note”.

#### **Speech to Text**
Microsoft Azure Cognitive Services was utilized for Speech to Text translation.  The integration effort was fairly straightforward by following Microsoft’s samples. Fine-tuning of the text to speech system for the wide range of healthcare-specific terms is beyond the scope of this project.  There are healthcare domain-specific sys-tems available on the commercial market that could be utilized if this project was moved beyond its current scope.
#### **FHIR Resource**
One challenge was locating the FHIR resource required for Clinical Notes.  The following documentation sources were located and used to resolve this challenge:
•	Clinical Notes at FHIR DevDays 2018 (Miller, 2018)
•	FHIR documentation for Clinical Notes (Representing Clinical Notes, n.d.) (Argonaut Clinical Notes Implementation Guide, n.d.) (Clinical Notes Guidance, n.d.)
#### **External Tools & Libraries**
The application was built using Google’s [Angular Framework](https://angular.io) and uses the open source [PrimeNG](https://www.primefaces.org/primeng/) User Interface control library.  It uses the [FHIR JS](https://github.com/FHIR/fhir.js/) client to communicate with the FHIR server. The project skeleton was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

NoteX uses keyword/phrase matching to identify data candidates for FHIR lookup.  It uses a configuration system for linking keywords to specific FHIR observations.  This allows the capabilities to grow without additional coding.  The configuration is described in the User Manual. The application could be further enhanced with Natural Lan-guage Processing (NLP) in the future.

Many aspects of security and data privacy are handled by leveraging SMART on FHIR.  This provides a secure mechanism for authentication and data connectivity to the EHR.  Microsoft provides HITECH and HIPAA certification for their cloud services.

## DEVELOPING LOCALLY

### Development server

Run `ng serve` to start a dev server running on port 4200. The app will automatically reload if you change any of the source files.

Navigate to `https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r4&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=http%3A%2F%2Flocalhost%3A4200%2Flaunch&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&pt_skip_login=0&public_key=&sb=&sde=&sim_ehr=0&token_lifetime=15&user_pt=fc200fa2-12c9-4276-ba4a-e0601d424e55`.

Select the following:
* Provider EHR Launch (practitioner opens the app from within an EHR)
* Be sure to uncheck "Simulate launch within the EHR user interface"

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Adding GitHub Pages deployment

Run `ng add angular-cli-ghpages`

### Deploying to GitHub Pages

Run `ng deploy`
* Deploys to gh-pages branch


## REFERENCES
Argonaut Clinical Notes Implementation Guide. (n.d.). Retrieved from HL7 FHIR: http://www.fhir.org/guides/argonaut/clinicalnotes/1.0.0/StructureDefinition-argo-clinicalnotes.html

Clinical Notes Guidance. (n.d.). Retrieved from HL7 FHIR® US Core Implementation Guide: https://build.fhir.org/ig/HL7/US-Core-R4/clinical-notes-guidance.html

Mason, A. G. (2020, February 21). Final Report Delivers a Strategy to Reduce EHR Burden. Retrieved from HealthITBuzz: https://www.healthit.gov/buzz-blog/health-it/final-report-delivers-a-strategy-to-reduce-ehr-burden

Miller, M. (2018, November 14). Clinical Notes. Retrieved from HL7 FHIR DevDays 2018: https://www.devdays.com/wp-content/uploads/2019/03/DD18-EU-Michelle-Miller-Clinical-Notes-2018-11-14.pdf

Office-based Physician Electronic Health Record Adoption. (n.d.). Retrieved from ONC for HIT: https://dashboard.healthit.gov/quickstats/pages/physician-ehr-adoption-trends.php

Representing Clinical Notes. (n.d.). Retrieved from HealthIT.gov: https://www.healthit.gov/isa/representing-clinical-notes

Strategy on Reducing Burden Relating to the Use of Health IT and EHRs. (n.d.). Retrieved from ONC for HIT: https://www.healthit.gov/sites/default/files/page/2020-02/BurdenReport_0.pdf

The Future of Healthcare: A National Survey of Physicians - 2018. (n.d.). Retrieved from https://www.thedoctors.com/contentassets/23c0cee958364c6582d4ba95afa47fcc/tdc_the-future-of-healthcare-survey-2018.pdf
