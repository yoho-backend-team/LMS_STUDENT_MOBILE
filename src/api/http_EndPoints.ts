import { Endpoints } from './httpTypes';

const getEndpoints = (): Endpoints => {
  return {
    auth: {
      login: '/institutes/auth/student/login',
      verify_otp: '/institutes/auth/student/verify-otp',
      forget_password: '/institutes/auth/profile/forgot-password',
      reset_password: '/institutes/auth/profile/reset-password',
      change_password: 'institutes/auth/student/change-password',
      log_out: '/institutes/auth/student/logout',
    },
    course: {
      get: `/institutes/:instituteuuid/branches/:branchuuid/course/:courseId`,
      // getwithclass: `/institutes/${institute}/branches/${branch}/course/${course}/classes`
    },
    class: {
      get: `/institutes/class/`,
      getwithId: `/institutes/class/course/`,
    },
    attendance: {
      get: '/institutes/attedance/student-attendance/',
      getDate: '/institutes/attedance/student-attendance/daily',
      class_attendance: '/attendance/class',
    },
    payments: {
      getFees: `/institutes/payments/student-fee/`,
    },
    ticket: {
      create: '/institutes/student-ticket/create',
      get: '/institutes/student-ticket/getall',
      getById: '/institutes/student-ticket/',
    },
    notification: {
      get: '/institutes/students/notifications/',
      update_status: '/institutes/students/notifications/status/',
      delete: `/institutes/students/notifications/student-notifications/`,
    },
    activity: {
      get: `/institutes/user/activity/`,
    },
    faq: {
      get: `institutes/faq/all`,
    },
    help: {
      get: `/helpcenter`,
    },

    reports: {
      get: '/institutes/reports/users/student',
    },
    community: {
      get: `/institutes/community/course/:courseId`,
      get_messages: `/institutes/community/messages/all/`,
    },
    profile: {
      get: `/institutes/auth/profile/me/`,
      update: '/institutes/auth/profile/me/',
    },
    common: {
      file: {
        upload: '/upload/',
      },
    },
    notificationSubscription: {
      post: '/notification/subscribe',
    },
  };
};

const Http_Endpoints = getEndpoints();

export default Http_Endpoints;
