"use strict";
class Boid {
    constructor() {
        this.friendsList = [];
        this.position = { x: Math.random() * TRACK_W, y: Math.random() * TRACK_H };
        const dir = Math.random() * 2 * Math.PI;
        this.velocity = new Vector(Math.cos(dir), Math.sin(dir));
    }
    step() {
        this.position.y += TRACK_H + this.velocity.y * Boid.stepSize;
        this.position.x += TRACK_W + this.velocity.x * Boid.stepSize;
        this.position.y %= Math.abs(TRACK_H);
        this.position.x %= Math.abs(TRACK_W);
    }
    // 1.5673503681797918 4.744742698201563
    updateFriends(population) {
        this.friendsList = [];
        if (isNaN(this.position.x)) {
            return;
        }
        population.forEach(stranger => {
            if (stranger == this || stranger == boidList[0])
                return; // So do both of yourselves a favor and just let that handsome devil go about his business --Cave Johnson
            // Set up the vector
            const OUT_VECTOR = (new Vector(this.position)).subtract(stranger.position);
            // First calculate distance
            if (OUT_VECTOR.magnitude > Boid.viewDistance)
                return; // They are not in range
            // Second calculate if we can see them
            // Find the angle between the outbound vector and where we are facing and compare
            if (Math.abs(OUT_VECTOR.angleDifference(this.velocity)) > Boid.viewConeSpan / 2)
                return;
            // If we made it here we have found a new frend!
            this.friendsList.push(stranger); // Stranger no more
        });
    }
    updateFacing() {
        // Who's driving
        if (this == boidList[boidInFocus]) {
            if (rightPress && !leftPress) {
                this.velocity.addAngle(-Boid.maxTurnAngle / 8).normalize();
            }
            else if (!rightPress && leftPress) {
                this.velocity.addAngle(Boid.maxTurnAngle / 8).normalize();
            }
            return;
        }
        // First check to see if we have any friends
        if (this.friendsList.length == 0)
            return;
        let rule1Adjust = new Vector();
        let rule2Adjust = new Vector();
        let rule3Adjust = new Vector();
        // Add some noise
        const noise = new Vector(Math.random() - 0.5, Math.random() - 0.5).div(2);
        // Lets follow the first rule first
        if (RULE_1) {
            // Steer towards the middle of the group
            // Calculate the center of our group
            rule1Adjust.add(this.position);
            this.friendsList.forEach(friend => {
                rule1Adjust.add(friend.position);
            });
            // Calculate average
            rule1Adjust.div(this.friendsList.length + 1);
            // Direction we need to steer is the difference between our position and the average
            rule1Adjust.subtract(this.position).normalize().mult(Boid.centerGravityForce);
        }
        if (RULE_2) {
            // Steer away if you are too close to your neighbor
            // So first filter out the friends
            this.friendsList.forEach(friend => {
                let between = new Vector(this.position).subtract(friend.position);
                if (between.magnitude > Boid.boidProximityDistanceMinimum)
                    return;
                // Steer away from that friend
                rule2Adjust.add(between).normalize();
            });
            rule2Adjust.div(this.friendsList.length);
            let something = rule2Adjust.normalize();
            if (something == undefined)
                console.log('hey');
            rule2Adjust.mult(Boid.avoidFriendsForce);
        }
        if (RULE_3) {
            // Match the angle the group is facing in
            // So first calculate the average direction
            rule3Adjust = new Vector(this.velocity);
            this.friendsList.forEach(friend => {
                rule3Adjust.add(friend.velocity);
            });
            rule3Adjust.mult(Boid.alignmentForce / (this.friendsList.length + 1));
        }
        // All rules have been accounted for, now adjust our heading
        rule1Adjust.add(rule2Adjust).add(rule3Adjust).normalize();
        const diff = rule1Adjust.angleDifference(this.velocity);
        if (Math.abs(diff) > Boid.maxTurnAngle) {
            if (diff > 0) {
                this.velocity.addAngle(-Boid.maxTurnAngle);
            }
            else {
                this.velocity.addAngle(Boid.maxTurnAngle);
            }
        }
        else {
            this.velocity.add(rule1Adjust);
        }
        this.velocity.normalize();
    }
}
Boid.stepSize = 1;
Boid.viewDistance = 28;
Boid.viewConeSpan = 1.2 * Math.PI; // Size in radians
Boid.centerGravityForce = 0.03;
Boid.avoidFriendsForce = 6;
Boid.alignmentForce = 1;
Boid.avoidObstacleForce = 10;
Boid.boidProximityDistanceMinimum = 10;
Boid.obstacleProximityMinimum = 16;
Boid.maxTurnAngle = 0.3;
