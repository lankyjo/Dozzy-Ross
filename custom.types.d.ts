interface ReasonProps {
  id: number;
  value: string;
  label: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}
interface ContactInfoProps {
  username: any;
  url?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  socialProfiles: {
    name: string;
    url: string;
  }[];
}

interface RegisterFormValues {
  referral_code?: string;
  email: string;
  password: string;
  phone: string;
  username: string;
  acceptTerms?: boolean;
}
interface NewPasswordProps {
  password: string;
  confirmPassword: string;
  email: string;
  code: number;
}

interface OTPValues {
  email: string;
  code: number;
  url: string;
  type?: string | null;
}

interface TempValueType {
  val: any;
  setVal: (val: any) => void;
  val: string;
  setVal: (val: string) => void;
  organizer: OrganizerProps;
  setOrganizer: (organizer: OrganizerProps) => void;
  events: EventProps[];
  setEvents: (events: EventProps[]) => void;

  classifyEvents: {
    upcoming: EventProps[];
    past: EventProps[];
    today: EventProps[];
  };
  setClassyFieldEVents: (events: {
    upcoming: EventProps[];
    past: EventProps[];
    today: EventProps[];
  }) => void;
}

interface PostToEmailProps {
  email: string;
  url: string;
}
interface ChangePasswordProps {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface CategoryProps {
  id?: string;
  _id: string;
  name: string;
  description: string;
  image: string;
  isDeleted: boolean;
  screenposition: number;
  mobilescreenposition: number;
  logo: string;
  link?: string;
}

interface OrganizerProps {
  imageUrl: string;
  accountSource: string;
  accountSourceVerified: boolean;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  isVerifiedOrganizer: boolean;
  role: string;
  accountClosedReason: string;
  isDeleted: boolean;
  dob: string;
  brandName: string;
  referralCode: string;
  referredBy: string;
  totalReferrals: string;
  deactivated: boolean;
  socialProfiles?: { name?: string; url: string }[];
  username: string;
  totalEventsCreated: number;
  totalFollowers: number;
  result: boolean;
}

interface EventProps {
  description;
  approvalStatus?: string;
  approvalNote?: string;
  isVerified?: boolean;
  inviteId?: string;
  handleAcceptInvite?: (id: string) => void;
  accepting?: boolean;
  inviteStatus?: string;
  isFromInvite?: boolean;
  event_title: string;
  location: string;
  date: string;
  fee: string;
  status?: string;
  counter_event_date: string;
  currency: {
    createdAt: string;
    isActive: boolean;
    isDeleted: boolean;
    name: string;
    symbol: string;
    updatedAt: string;
    _id: string;
  };
  title?: string;
  startDate;
  minTicket: {
    price?: number;
    currency?: {
      createdAt: string;
      isActive: boolean;
      isDeleted: boolean;
      name: string;
      symbol: string;
      updatedAt: string;
      _id: string;
    };
  };
  organizer?: {
    firstName?: string;
    lastName?: string;
    isVerifiedOrganizer?: boolean;
    socialProfiles?: [{ name?: string?; url: string }];
    isVerified?: boolean;
    accountClosedReason?: string;
    createdAt?: string;
    deactivated?: boolean;
    dob?: string;
    email?: string;
    emailVerified?: boolean;
    firstName?: string;
    fullName?: string;
    imageUrl?: string;
    isDeleted?: string;
    isVerifiedOrganizer?: string;
    lastName?: string;
    phone?: string;
    referralCode?: string;
    referredBy?: string;
    role?: string;

    totalReferrals?: number;
    updatedAt?: string;
    username?: string;

    _id?: string;
  };
  banner?: { url: string };
  image?: string;
  primaryVenue?: PrimaryVenue;
  onlineVenue?: OnlineVenue;
  venue: { venue: string; link: string };
  isVerified?: boolean;
  eventLocationType?: any;
  isPaidEvent: boolean;
  isFeatured: boolean;

  isPrivateEvent: boolean;
  isSoldOut: boolean;
  isDeleted: boolean;
  _id: string;
  slug: string;
  category: CategoryProps;
  subCategory: CategoryProps;
  qrcode: string;
  ticketGroups?: [];
  endDate: string;

  totalSales?: number;
  totalWithdrawn?: number;
  availableBalance?: number;
  availableToWithdraw?: number;
  totalTicketsSold?: number;
  totalCheckedIn?: number;
  currentPage?: number;

  type?: string;
  tourLocations?: TourLocationProps[];
}
