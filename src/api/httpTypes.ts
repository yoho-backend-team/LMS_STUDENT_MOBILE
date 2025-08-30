export type Endpoints = {
  auth: {
    login: string;
    verify_otp: string;
    forget_password: string;
    reset_password: string;
    change_password: string;
    log_out: string;
  };
  course: {
    get: string;
  };
  class: {
    get: string;
    getwithId: string;
  };
  attendance: {
    get: string;
    getDate: string;
    class_attendance: string;
  };
  payments: {
    getFees: string;
  };
  ticket: {
    create: string;
    get: string;
    getById: string;
  };
  notification: {
    get: string;
    update_status: string;
    delete: string;
  };
  activity: {
    get: string;
  };
  faq: {
    get: string;
  };
  help: {
    get: string;
  };
  reports: {
    get: string;
  };
  community: {
    get: string;
    get_messages: string;
  };
  profile: {
    get: string;
    update: string;
  };
  common: {
    file: {
      upload: string;
    };
  };

  notificationSubscription: {
    post: string;
  };

  placement: {
    get: string;
  };
};
