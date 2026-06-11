import { Appointment, AppointmentStatus } from "@prisma/client";


export function toFhirAppointment(appointment: any) {
  return {
    resourceType: "Appointment",
    id: appointment.id,
    status: mapStatusToFhir(appointment.status),
    description: appointment.reason,
    start: appointment.startTime.toISOString(),
    end: appointment.endTime.toISOString(),
    participant: [
      {
        actor: {
          reference: `Patient/${appointment.patientId}`,
          display: appointment.patient
            ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : undefined
        },
        status: 'accepted',
      },
      {
        actor: {
          reference: `Practitioner/${appointment.doctorId}`,
          display: appointment.doctor?.email,
        },
        status: 'accepted',
      },
    ],
  };
}

function mapStatusToFhir(status: AppointmentStatus) {
  switch (status) {
    case AppointmentStatus.SCHEDULED:
      return 'booked';
    case AppointmentStatus.CANCELLED:
      return 'cancelled';
    case AppointmentStatus.COMPLETED:
      return 'fulfilled';
    default:
      return 'proposed';
  }
}