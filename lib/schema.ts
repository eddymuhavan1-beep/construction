import { pgTable, text, timestamp, integer, decimal, varchar, boolean, json, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["admin", "supervisor", "worker"]);
export const projectStatusEnum = pgEnum("project_status", ["planning", "active", "completed", "paused"]);
export const phaseStatusEnum = pgEnum("phase_status", ["pending", "in_progress", "completed", "delayed"]);
export const activityStatusEnum = pgEnum("activity_status", ["planned", "in_progress", "completed", "blocked"]);
export const materialStatusEnum = pgEnum("material_status", ["available", "shortage", "on_order", "delayed"]);
export const equipmentStatusEnum = pgEnum("equipment_status", ["operational", "maintenance", "idle", "retired"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late", "leave"]);

// Users & Auth
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  image: text("image"),
  role: roleEnum("role").default("worker").notNull(),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("planning").notNull(),
  location: varchar("location", { length: 255 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  spent: decimal("spent", { precision: 12, scale: 2 }).default("0"),
  managerId: text("manager_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Phases
export const phases = pgTable("phases", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: phaseStatusEnum("status").default("pending").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  progress: integer("progress").default(0),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activities/Tasks
export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  phaseId: text("phase_id")
    .notNull()
    .references(() => phases.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: activityStatusEnum("status").default("planned").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  progress: integer("progress").default(0),
  assignedTo: text("assigned_to").references(() => users.id),
  duration: integer("duration"), // in days
  isCritical: boolean("is_critical").default(false),
  dependencies: json("dependencies"), // array of activity IDs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site Diary
export const diaryEntries = pgTable("diary_entries", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  content: text("content").notNull(),
  weather: varchar("weather", { length: 100 }),
  temperature: integer("temperature"), // in Celsius
  workforce: integer("workforce"), // number of workers
  equipment: text("equipment"), // comma-separated list
  progress: varchar("progress", { length: 500 }),
  issues: text("issues"),
  aiSummary: text("ai_summary"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const diaryPhotos = pgTable("diary_photos", {
  id: text("id").primaryKey(),
  diaryEntryId: text("diary_entry_id")
    .notNull()
    .references(() => diaryEntries.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: varchar("caption", { length: 500 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Materials & Inventory
export const materials = pgTable("materials", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  quantity: integer("quantity").default(0),
  unit: varchar("unit", { length: 50 }),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  status: materialStatusEnum("status").default("available").notNull(),
  supplier: varchar("supplier", { length: 255 }),
  orderDate: timestamp("order_date"),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const materialUsage = pgTable("material_usage", {
  id: text("id").primaryKey(),
  materialId: text("material_id")
    .notNull()
    .references(() => materials.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  activity: varchar("activity", { length: 255 }),
  notes: text("notes"),
});

// Workforce & Attendance
export const workforceProfiles = pgTable("workforce_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  position: varchar("position", { length: 100 }),
  skills: json("skills"), // array of skills
  experienceYears: integer("experience_years"),
  qualifications: json("qualifications"), // array of qualifications
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }),
  emergencyContact: varchar("emergency_contact", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  hoursWorked: decimal("hours_worked", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payroll = pgTable("payroll", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id),
  period: varchar("period", { length: 50 }).notNull(), // e.g., "2024-01"
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }),
  overtimeHours: decimal("overtime_hours", { precision: 8, scale: 2 }).default("0"),
  overtimeRate: decimal("overtime_rate", { precision: 8, scale: 2 }),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0"),
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }),
  paymentDate: timestamp("payment_date"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, completed, failed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Equipment & Assets
export const equipment = pgTable("equipment", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  serialNumber: varchar("serial_number", { length: 100 }).unique(),
  status: equipmentStatusEnum("status").default("operational").notNull(),
  acquisitionDate: timestamp("acquisition_date"),
  acquisitionCost: decimal("acquisition_cost", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  location: varchar("location", { length: 255 }),
  gpsLat: decimal("gps_lat", { precision: 10, scale: 6 }),
  gpsLng: decimal("gps_lng", { precision: 10, scale: 6 }),
  lastServiceDate: timestamp("last_service_date"),
  nextServiceDate: timestamp("next_service_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const equipmentMaintenance = pgTable("equipment_maintenance", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  type: varchar("type", { length: 100 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  description: text("description"),
  performedBy: varchar("performed_by", { length: 255 }),
  notes: text("notes"),
});

// Financial Tracking
export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  vendor: varchar("vendor", { length: 255 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgets = pgTable("budgets", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(),
  allocatedAmount: decimal("allocated_amount", { precision: 12, scale: 2 }).notNull(),
  spentAmount: decimal("spent_amount", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dashboard & Alerts
export const alerts = pgTable("alerts", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 100 }).notNull(), // budget_exceeded, schedule_delay, material_shortage, etc
  severity: varchar("severity", { length: 50 }).notNull(), // critical, warning, info
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  projectsManaged: many(projects),
  activitiesAssigned: many(activities),
  diaryEntries: many(diaryEntries),
  workforceProfile: many(workforceProfiles),
  attendance: many(attendance),
  payroll: many(payroll),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  phases: many(phases),
  diaryEntries: many(diaryEntries),
  materials: many(materials),
  attendance: many(attendance),
  equipment: many(equipment),
  expenses: many(expenses),
  budgets: many(budgets),
  alerts: many(alerts),
  manager: one(users),
}));

export const phasesRelations = relations(phases, ({ many, one }) => ({
  activities: many(activities),
  project: one(projects),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  phase: one(phases),
  assignee: one(users),
}));

export const diaryEntriesRelations = relations(diaryEntries, ({ many, one }) => ({
  photos: many(diaryPhotos),
  project: one(projects),
  author: one(users),
}));

export const materialsRelations = relations(materials, ({ many, one }) => ({
  usage: many(materialUsage),
  project: one(projects),
}));

export const equipmentRelations = relations(equipment, ({ many, one }) => ({
  maintenance: many(equipmentMaintenance),
  project: one(projects),
}));
