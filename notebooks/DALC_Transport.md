# DALC Transport System

## Purpose

The transport module handles mobility services within the Dubai À La Carte platform.

This includes professional driver services, vehicle rental, airport transfers and private aviation.

The transport module does not include activities such as helicopter tours or water sports. Those belong to the experiences module.

## Transport Services

Chauffeur Service  
Car Rental  
Airport Transfer  
Private Aviation

## Folder Structure

src/components/transport  
src/pages/transport  
src/data/transport

Components

Chauffeur  
CarRental  
AirportTransfer  
PrivateAviation

Pages

transport/chauffeur  
transport/cars  
transport/airport-transfer  
transport/private-aviation

## Request Flow

All services use DALC request system.

User submits request instead of direct booking.

Request fields

serviceType  
vehicleOrAircraft  
pickupLocation  
destination  
requestedDate  
notes

Requests are processed by concierge system.

## Future Expansion

supplier inventory system  
availability management  
map integration  
AI itinerary planning
