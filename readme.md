## Drones

[[TOC]]

---

:scroll: *START*


### Introduction

There is a major new technology that is destined to be a disruptive force in the field of transportation: *the drone*. Just as the mobile phone allowed developing countries to leapfrog older technologies for personal communication, the drone has the potential to leapfrog traditional transportation infrastructure.

Useful drone functions include delivery of small items that are (urgently) needed in locations with difficult access.

---

### Task description

We have a fleet of *10 drones. A drone is capable of carrying devices, other than cameras, and capable of delivering small loads. For our use case **the load is medications*.

A *Drone* has:
- serial number (100 characters max);
- model (Lightweight, Middleweight, Cruiserweight, Heavyweight);
- weight limit (500gr max);
- battery capacity (percentage);
- state (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING).

Each *Medication* has: 
- name (allowed only letters, numbers, ‘-‘, ‘_’);
- weight;
- code (allowed only upper case letters, underscore and numbers);
- image (picture of the medication case).

Develop a service via REST API that allows clients to communicate with the drones (i.e. *dispatch controller*). The specific communicaiton with the drone is outside the scope of this task. 

The service should allow:
- registering a drone;
- loading a drone with medication items;
- checking loaded medication items for a given drone; 
- checking available drones for loading;
- check drone battery level for a given drone;

> Feel free to make assumptions for the design approach. 

---

### Requirements

While implementing your solution *please take care of the following requirements*: 

#### Functional requirements

- There is no need for UI;
- Prevent the drone from being loaded with more weight that it can carry;
- Prevent the drone from being in LOADING state if the battery level is *below 25%*;
- Introduce a periodic task to check drones battery levels and create history/audit event log for this.

---

#### Non-functional requirements

- Input/output data must be in JSON format;
- Your project must be buildable and runnable;
- Your project must have a README file with build/run/test instructions (use DB that can be run locally, e.g. in-memory, via container);
- Required data must be preloaded in the database.
- JUnit tests are optional but advisable (if you have time);
- Advice: Show us how you work through your commit history.

---

:scroll: *END*

// Solution

Assumptions made
Drones can be loaded with more than one medication
Drone Weight Limits(max weight a drone can carry):
Lightweight - 200gr
Middleweight - 300gr
Cruiserweight - 400gr
Heavyweight - 500gr

A drone enters the 'LOADING' state when a medication is successfully loaded onto it. It enters the 'LOADED' state when (after a successful onload) its weight limit is exceeded if the lightest medication is loaded onto it.


To implement the service described in the task, I would suggest using a RESTful API built with a web framework such as Flask or Express.js. The API should have endpoints for each of the required actions (registering a drone, loading a drone with medication, checking loaded medication, checking available drones, and checking the drone battery level).

For the database, I would suggest using a NoSQL database such as MongoDB or an SQLite database, which can be run locally and easily integrated with the web framework. The database should have collections/tables for drones and medications, with fields for each of the attributes listed in the task description.

The API should include a validation step before allowing medication to be loaded onto a drone to prevent the drone from being loaded with more weight than it can carry. This validation can be done by checking the medication's weight against the drone's weight limit.

A similar validation step can be added to the API endpoint responsible for loading a drone with medication to prevent the drone from being in the LOADING state if the battery level is below 25%.

A periodic task can be implemented to check the battery levels of the drones and create an audit log of the results. This task can be set up to run at a specified interval using a library such as Celery or a cron job.

In terms of data format, the input and output should be in JSON format as per the requirement. The project should be buildable and runnable, with clear instructions on how to do so in the README file. The required data should be preloaded into the database and JUnit test cases are optional but advisable.


// DATABASE DESIGN
DBMS - MONGODB (COMPASS)

COLLECTIONS
Drones: This collection/table has fields for the drone's serial number, model, weight limit, battery capacity, and state. The serial number and model fields are of type string, while the weight limit and battery capacity fields are of type integer. The state field is of type enumeration and can include the values IDLE, LOADING, LOADED, DELIVERING, DELIVERED, and RETURNING.

Medications: This collection/table has fields for the medication's name, weight, code, and image. The name and code fields are of type string and can include only letters, numbers, ‘-‘, and ‘_’. The weight is of type integer, and the image is of binary data.

Drone_Medication: This collection/table has fields for drone id and medication id. It has a one-to-many relationship with drones and medications. This table will be used to track the medication loaded on each drone.

Battery_Logs: This collection/table has fields for drone id, battery percentage, and date_time. It will be used to track the battery level of each drone on a given date and time.

Additional fields, created_at and updated_at, were included to track when the records were created and last updated.

// COLLECTION SCHEMA MONGODB
Drones
{
    "_id": ObjectId,
    "serial_number": String,
    "model": String,
    "weight_limit": Number,
    "battery_capacity": Number,
    "state": String,
    "created_at": Date,
    "updated_at": Date
}
Medications
{
    "_id": ObjectId,
    "name": String,
    "weight": Number,
    "code": String,
    "image": Binary,
    "created_at": Date,
    "updated_at": Date
}
Drone Medication
{
    "_id": ObjectId,
    "drone_id": ObjectId,
    "medication_id": ObjectId,
    "created_at": Date,
    "updated_at": Date
}
Battery Logs
{
    "_id": ObjectId,
    "drone_id": ObjectId,
    "battery_percentage": Number,
    "date_time": Date,
    "created_at": Date,
    "updated_at": Date
}

// Routes
Register a drone: /api/drones with method POST: This endpoint accepts a JSON payload with the drone's serial number, model, weight limit, and battery capacity. The API then validates the payload and inserts a new document into the drones collection with the provided data making sure to include required default values for document id (_id), created_at, and updated_at times.

Load a drone with medication: /api/drones/:id/load with method POST: This endpoint accepts a JSON payload with the medication's code, and a query parameter for the id of the drone to be loaded. The API then validates the payload and the drone state, checks if the weight of medication is less than the weight limit of the drone, and also checks if the battery level is above 25%. If all validations pass, the API adds the medication to the drone by inserting a new document into the drone_medication collection with the provided data.

Check loaded medication items for a given drone: /api/drones/:id/medications with method GET: This endpoint accepts a query parameter for the id of the drone and returns a JSON array of all the medications currently loaded on the drone.

Check available drones for loading: /api/drones?state=IDLE with method GET: This endpoint accepts a query parameter for the state of the drone and returns a JSON array of all available drones (drones with state IDLE) that can be loaded with medication.

Check drone battery level for a given drone: /api/drones/:id/battery with method GET: This endpoint accepts a query parameter for the id of the drone and returns the current battery level of that drone.


// Battery level checks
To implement the battery level checks, you can use the following approach:

Periodic task: You can set up a periodic task using a library like Celery or a cron job, which runs at a specified interval to check the battery levels of the drones and create an audit log of the results. This task can query the drones collection for all drones, read the battery percentage and update the battery_logs collection with the current battery percentage and timestamp.

Event-driven: You can also implement the battery level checks in an event-driven manner, where the battery level is checked every time a drone changes its state. For example, when a drone's state changes from LOADING to LOADED, the API can check the battery percentage and update the battery_logs collection with the current battery percentage and timestamp.

Real-time monitoring: You can also implement a real-time monitoring of the battery percentage, where the API continuously checks the battery percentage of the drones and update the battery_logs collection with the current battery percentage and timestamp.

For example, If you choose to implement the battery level checks using a periodic task, you can use Celery library to schedule a task that