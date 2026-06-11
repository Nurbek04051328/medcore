import { ObservationStatus } from "@prisma/client";


export function toFhirObservation(observation: any) {
  return {
    resourceType: "Observation",
    id: observation.id,
    status: mapStatusTofhir(observation.status),
    code: {
      text: observation.code,
    },
    subject: {
      reference: `Patient/${observation.patientId}`,
      display: observation.patient
        ? `${observation.patient.firstName} ${observation.patient.lastName}` : undefined
    },
    effectiveDateTime: observation.observedAt.toISOString(),
    valueString: observation.unit
      ? `${observation.value} ${observation.unit}`
      : observation.value
  }
}

function mapStatusTofhir(status: ObservationStatus) {
  switch (status) {
    case ObservationStatus.FINAL:
      return 'final';
    case ObservationStatus.PRELIMINARY:
      return 'preliminary';
    case ObservationStatus.CANCELLED:
      return 'cancelled';
    default:
      return 'unknown';
  }
}