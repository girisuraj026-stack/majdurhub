import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  module Worker {
    public type RateType = {
      #sqft;
      #runningft;
      #perday;
    };

    public type Worker = {
      id : Nat;
      name : Text;
      mobile : Text;
      city : Text;
      experience : Nat;
      workType : Text;
      rateType : RateType;
      rateAmount : Nat;
      owner : Principal;
    };

    public func compare(w1 : Worker, w2 : Worker) : Order.Order {
      Nat.compare(w1.id, w2.id);
    };
  };

  module Job {
    public type Job = {
      id : Nat;
      workType : Text;
      areaSqft : Nat;
      address : Text;
      startDate : Text;
      description : Text;
      customerId : Principal;
      calculatedPrice : Nat;
    };

    public func compare(j1 : Job, j2 : Job) : Order.Order {
      Nat.compare(j1.id, j2.id);
    };
  };

  module Booking {
    public type Status = {
      #pending;
      #accepted;
      #inProgress;
      #completed;
    };

    public type PaymentMethod = {
      #cash;
      #upi;
      #wallet;
    };

    public type Booking = {
      id : Nat;
      jobId : Nat;
      workerId : Nat;
      customerId : Principal;
      status : Status;
      paymentMethod : PaymentMethod;
      totalPrice : Nat;
    };

    public func compare(b1 : Booking, b2 : Booking) : Order.Order {
      Nat.compare(b1.id, b2.id);
    };
  };

  module Rating {
    public type Rating = {
      bookingId : Nat;
      workerId : Nat;
      customerId : Principal;
      stars : Nat;
      review : Text;
    };

    public func compare(r1 : Rating, r2 : Rating) : Order.Order {
      Nat.compare(r1.bookingId, r2.bookingId);
    };
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let workers = Map.empty<Nat, Worker.Worker>();
  var nextWorkerId = 0;

  let jobs = Map.empty<Nat, Job.Job>();
  var nextJobId = 0;

  let bookings = Map.empty<Nat, Booking.Booking>();
  var nextBookingId = 0;

  let ratingList = List.empty<Rating.Rating>();

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerWorker(
    name : Text,
    mobile : Text,
    city : Text,
    experience : Nat,
    workType : Text,
    rateType : Worker.RateType,
    rateAmount : Nat
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can register workers");
    };

    let workerId = nextWorkerId;
    nextWorkerId += 1;

    let worker : Worker.Worker = {
      id = workerId;
      name;
      mobile;
      city;
      experience;
      workType;
      rateType;
      rateAmount;
      owner = caller;
    };

    workers.add(workerId, worker);
    workerId;
  };

  public shared ({ caller }) func updateWorker(
    id : Nat,
    name : Text,
    mobile : Text,
    city : Text,
    experience : Nat,
    workType : Text,
    rateType : Worker.RateType,
    rateAmount : Nat
  ) : async () {
    let existing = switch (workers.get(id)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };

    if (existing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the owner or admin can update this worker");
    };

    let updated : Worker.Worker = {
      id;
      name;
      mobile;
      city;
      experience;
      workType;
      rateType;
      rateAmount;
      owner = existing.owner;
    };

    workers.add(id, updated);
  };

  public query ({ caller }) func listWorkers() : async [Worker.Worker] {
    workers.values().toArray().sort();
  };

  public query ({ caller }) func listWorkersByType(workType : Text) : async [Worker.Worker] {
    let filtered = workers.values().filter(func(w) { w.workType == workType });
    filtered.toArray().sort();
  };

  public shared ({ caller }) func createJob(
    workType : Text,
    areaSqft : Nat,
    address : Text,
    startDate : Text,
    description : Text
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create jobs");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let calculatedPrice = calculatePriceInternal(workType, areaSqft);

    let job : Job.Job = {
      id = jobId;
      workType;
      areaSqft;
      address;
      startDate;
      description;
      customerId = caller;
      calculatedPrice;
    };

    jobs.add(jobId, job);
    jobId;
  };

  public query ({ caller }) func listJobsByCustomer(customerId : Principal) : async [Job.Job] {
    if (caller != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own jobs");
    };
    let filtered = jobs.values().filter(func(j) { j.customerId == customerId });
    filtered.toArray().sort();
  };

  public shared ({ caller }) func createBooking(
    jobId : Nat,
    workerId : Nat,
    paymentMethod : Booking.PaymentMethod
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?j) { j };
    };

    if (job.customerId != caller) {
      Runtime.trap("Unauthorized: Can only create bookings for your own jobs");
    };

    let bookingId = nextBookingId;
    nextBookingId += 1;

    let booking : Booking.Booking = {
      id = bookingId;
      jobId;
      workerId;
      customerId = caller;
      status = #pending;
      paymentMethod;
      totalPrice = job.calculatedPrice;
    };

    bookings.add(bookingId, booking);
    bookingId;
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, status : Booking.Status) : async () {
    let existing = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    let worker = switch (workers.get(existing.workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };

    let isCustomer = existing.customerId == caller;
    let isWorker = worker.owner == caller;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (not (isCustomer or isWorker or isAdmin)) {
      Runtime.trap("Unauthorized: Only the customer, worker, or admin can update this booking");
    };

    let updated : Booking.Booking = {
      id = bookingId;
      jobId = existing.jobId;
      workerId = existing.workerId;
      customerId = existing.customerId;
      status;
      paymentMethod = existing.paymentMethod;
      totalPrice = existing.totalPrice;
    };

    bookings.add(bookingId, updated);
  };

  public query ({ caller }) func listBookingsByWorker(workerId : Nat) : async [Booking.Booking] {
    let worker = switch (workers.get(workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };

    if (worker.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own worker bookings");
    };

    let filtered = bookings.values().filter(func(b) { b.workerId == workerId });
    filtered.toArray().sort();
  };

  public query ({ caller }) func listBookingsByCustomer(customerId : Principal) : async [Booking.Booking] {
    if (caller != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };

    let filtered = bookings.values().filter(func(b) { b.customerId == customerId });
    filtered.toArray().sort();
  };

  public shared ({ caller }) func addRating(bookingId : Nat, stars : Nat, review : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add ratings");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    if (booking.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the customer or admin can add a rating");
    };

    switch (booking.status) {
      case (#completed) {};
      case (_) { Runtime.trap("Cannot rate: Booking must be completed first") };
    };

    if (stars < 1 or stars > 5) {
      Runtime.trap("Invalid rating: Stars must be between 1 and 5");
    };

    let rating : Rating.Rating = {
      bookingId;
      workerId = booking.workerId;
      customerId = caller;
      stars;
      review;
    };

    ratingList.add(rating);
  };

  public query ({ caller }) func getWorkerRatings(workerId : Nat) : async [Rating.Rating] {
    let filtered = ratingList.filter(func(r) { r.workerId == workerId });
    filtered.toArray().sort();
  };

  public query ({ caller }) func getWorkerAverageRating(workerId : Nat) : async ?Float {
    let ratings = ratingList.filter(func(r) { r.workerId == workerId });
    let ratingsArray = ratings.toArray();

    if (ratingsArray.size() == 0) {
      return null;
    };

    var totalStars = 0;
    for (rating in ratingsArray.vals()) {
      totalStars += rating.stars;
    };

    let average = totalStars.toFloat() / ratingsArray.size().toFloat();
    ?average;
  };

  func calculatePriceInternal(workType : Text, areaSqft : Nat) : Nat {
    let matchingWorkers = workers.values().filter(func(w) { w.workType == workType });
    var totalRates = 0;
    var count = 0;

    for (worker in matchingWorkers) {
      totalRates += worker.rateAmount;
      count += 1;
    };

    if (count == 0) { 0 } else {
      let averageRate = totalRates / count;
      areaSqft * averageRate;
    };
  };

  public query ({ caller }) func calculatePrice(workType : Text, areaSqft : Nat) : async Nat {
    calculatePriceInternal(workType, areaSqft);
  };

  public query ({ caller }) func adminListAllWorkers() : async [Worker.Worker] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    workers.values().toArray().sort();
  };

  public query ({ caller }) func adminListAllBookings() : async [Booking.Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func adminGetPlatformStats() : async {
    totalWorkers : Nat;
    totalBookings : Nat;
    totalRevenue : Nat;
    completedBookings : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let totalWorkers = workers.size();
    let totalBookings = bookings.size();

    var totalRevenue = 0;
    var completedBookings = 0;

    for (booking in bookings.values()) {
      switch (booking.status) {
        case (#completed) {
          completedBookings += 1;
          totalRevenue += booking.totalPrice;
        };
        case (_) {};
      };
    };

    {
      totalWorkers;
      totalBookings;
      totalRevenue;
      completedBookings;
    };
  };
};
