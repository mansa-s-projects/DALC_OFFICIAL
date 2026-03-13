# DALC Request System

## Purpose

The request system is the central service orchestration layer of DALC.

Users submit requests for services instead of direct checkout.

This allows concierge coordination and supplier matching.

## Request Types

transport request  
experience request  
restaurant reservation  
event access  
custom concierge request

## Request Payload

serviceType  
itemName  
location  
date  
notes

Example

{
  "serviceType": "chauffeur",
  "itemName": "Mercedes S Class",
  "location": "Dubai Marina",
  "date": "2026-04-01",
  "notes": "Airport pickup"
}

## Processing Flow

User submits request  
Request stored in database  
Admin dashboard receives request  
Supplier contacted  
Service confirmed
