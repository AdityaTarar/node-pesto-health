const db = require('../../models')
const DoctorAvailability = db.doctorsAvailability
exports.createDoctorsAvailabilitiy = async (req, res) => {
  const { doctorId, availability } = req.body; // `availability` is expected to be an array based on your payload

  try {
    const docAvailability = await DoctorAvailability.findOne({ doctorId });

    if (docAvailability) {
      // Iterate over the availability array from the payload
      let updateNeeded = false;
      for (let newAvail of availability) {
        const isDateExist = docAvailability.availability.some(avail => avail.date === newAvail.date);

        if (!isDateExist) {
          // If the date doesn't exist, add the new availability entry
          docAvailability.availability.push(newAvail);
          updateNeeded = true;
        } else {
          // Handle the case where the date already exists, e.g., by rejecting the update or updating the existing entry
          // For simplicity, we'll just log it here; you might want to handle this differently
          console.log(`Date ${newAvail.date} already exists for doctorId ${doctorId}.`);
        }
      }

      if (updateNeeded) {
        await docAvailability.save();
        res.json({ message: "Doctor's availability updated successfully", data: docAvailability });
      } else {
        res.status(400).json({ message: "No new dates were added. Duplicate dates were not added." });
      }
    } else {
      // No existing record for this doctorId, create a new one
      const newDocAvailability = new DoctorAvailability({
        doctorId,
        availability // This directly uses the array from the payload
      });
      await newDocAvailability.save();
      res.status(201).json({ message: "Doctor's availability created successfully", data: newDocAvailability });
    }
  } catch (error) {
    console.error(error); // For debugging
    res.status(500).json({ message: "An error occurred", error: error.toString() });
  }
};

const generateTimeSlots = (date, availableTimeSlots, duration, unavailableTimeSlots) => {
  let generatedAvailableTimeSlots = [];
  availableTimeSlots.forEach(timeRange => {
    const [start, end] = timeRange.split(' - ');
    let startTime = new Date(`${date} ${start}`);
    const endTime = new Date(`${date} ${end}`);

    while (startTime < endTime) {
      const endTimeSlot = new Date(startTime.getTime() + duration * 60000);
      if (endTimeSlot <= endTime) { // Ensure the slot doesn't exceed the range
        const formattedStartTime = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const formattedEndTime = endTimeSlot.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        generatedAvailableTimeSlots.push(`${formattedStartTime} - ${formattedEndTime}`);
      }
      startTime = endTimeSlot;
    }
  });

  // Assuming unavailableTimeSlots is an array of string time ranges like availableTimeSlots
  // If not, you need to adjust the logic to fit the actual data structure
  let generatedUnavailableTimeSlots = unavailableTimeSlots; // Placeholder, adjust as needed

  return {
    date,
    availableTimeSlots,
    generatedAvailableTimeSlots,
    unavailableTimeSlots,
    generatedUnavailableTimeSlots
  };
};

exports.getDoctorsAvailability = async (req, res) => {
  const { doctorId } = req.body;
  const currentDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  try {
    const doctorsAvailability = await DoctorAvailability.findOne({ doctorId: doctorId });
    if (doctorsAvailability && doctorsAvailability.availability) {
      const filteredDoctorAvailability = doctorsAvailability.availability.filter(appointment => appointment.date >= currentDate).map(appointment => {
        return generateTimeSlots(appointment.date, appointment.availableTimeSlots, parseInt(appointment.duration), appointment.unavailableTimeSlots);
      });

      console.log('doctorsAvailability', filteredDoctorAvailability);
      res.status(200).json(filteredDoctorAvailability);
    } else {
      res.status(404).json({ message: 'Doctor availability not found' });
    }
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
