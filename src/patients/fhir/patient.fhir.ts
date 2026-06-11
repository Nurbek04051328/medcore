import { Gender, Patient } from "@prisma/client";


export function toFhirPatient(patient: Patient) {
  return {
    resourceType: "Patient",
    id: patient.id,
    name: [
      {
        family: patient.lastName,
        given: [patient.firstName],
      },
    ],
    gender: mapgenderToThir(patient.gender),
    birthDate: patient.birthDate.toISOString().split('T')[0],
    telecom: patient.phone
      ? [
        {
          system: 'phone',
          value: patient.phone,
          use: 'mobile',
        },
      ]
      : [],
  };
}

function mapgenderToThir(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return 'male';
    case Gender.FEMALE:
      return 'female';
    default:
      return 'unknown'
  }
}