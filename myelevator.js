/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */

/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */


Elevator.prototype.decide = function() {
    var simulator = Simulator.get_instance();
    var building = simulator.get_building();
    var num_floors = building.get_num_floors();
    var elevators = Simulator.get_instance().get_building().get_elevator_system().get_elevators();
    var requests = simulator.get_requests();
    var elevator = this;
    var people = this.get_people();


    if (people == 0) {
        for (var i = 0; i < requests.length; i++) {
            var handled = false;
            for (var j = 0; j < elevators.length; j++) {
                if (elevators[j].get_destination_floor() == requests[i]) {
                    handled = true;
                    break;
                }
            }
            if (!handled) {
                if (elevator.at_floor() < elevator.get_destination_floor()) {
                    elevator.direction = 'naik';  
                } 
                else {
                    elevator.direction = 'turun';
                }
                
                return this.commit_decision(requests[i]);
            }
        }
    }

    if (elevator) {
        if (people.length > 0) {
            people.sort(function(a, b) {
                return a.get_destination_floor() - b.get_destination_floor();
            });
            if (elevator.direction == 'naik') {
                requests.sort();

                for (a = elevator.at_floor(); a <= num_floors; a++) {
                    if (people.length < Config.elevator_capacity) {
                        if (request(a, requests, elevators)) {
                            return this.commit_decision(a);
                        }
                    }

                    for (i = 0; i < people.length; i++) {
                        if (a == people[i].get_destination_floor()) {
                            return this.commit_decision(a);
                        }
                    }
                }

                elevator.direction = 'turun';
                people.reverse();
                requests.reverse();

                for (a = elevator.at_floor(); a > 0; a--) {
                    if (people.length < Config.elevator_capacity) {
                        if (request(a, requests, elevators)) {
                            return this.commit_decision(a);
                        }
                    }

                    for (i = 0; i < people.length; i++) {
                        if (a == people[i].get_destination_floor()) {
                            return this.commit_decision(a);
                        }
                    }
                }
            }
            else {
                people.reverse();
                requests.reverse();

                for (a = elevator.at_floor(); a > 0; a--) {
                    if (people.length < Config.elevator_capacity) {
                        if (request(a, requests, elevators)) {
                            return this.commit_decision(a);
                        }
                    }

                    for (i = 0; i < people.length; i++) {
                        if (a == people[i].get_destination_floor()) {
                            return this.commit_decision(a);
                        }
                    }
                }

                elevator.direction = 'naik';
                people.reverse();
                requests.sort();

                for (a = elevator.at_floor(); a <= num_floors; a++) {
                    if (people.length < Config.elevator_capacity) {
                        if (request(a, requests, elevators)) {
                            return this.commit_decision(a);
                        }
                    }

                    for (i = 0; i < people.length; i++) {
                        if (a == people[i].get_destination_floor()) {
                            return this.commit_decision(a);
                        }
                    }
                }
            }
        }
    }

    return this.commit_decision(Math.floor(num_floors / 2));
};

 function request(a, requests, elevators) {
    for (i = 0; i < requests.length; i++) {
        if (a == requests[i]) {
            var req_handle = false;
            for (j = 0; j < elevators.length; j++) {
                if (elevators[j].get_destination_floor() == a) {
                    req_handle = true;
                }
            }

            if (!req_handle) {
                return true;
            }
        }
    }
    return false;
}



