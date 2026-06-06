import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  numeric,
  date,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Every app table carries a plain `userId` column for per-user scoping.

export const projectPhases = pgTable("project_phases", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  weight: integer("weight").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const phaseActivities = pgTable("phase_activities", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  phaseId: integer("phase_id").notNull(),
  name: text("name").notNull(),
  floorLabel: text("floor_label"),
  weight: integer("weight").notNull().default(1),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("not_started"),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const siteDiary = pgTable("site_diary", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  entryDate: date("entry_date").notNull(),
  weather: text("weather"),
  workDone: text("work_done").notNull(),
  issues: text("issues"),
  notes: text("notes"),
  photoUrls: text("photo_urls").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  category: text("category"),
  reorderLevel: numeric("reorder_level").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const materialReceipts = pgTable("material_receipts", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  materialId: integer("material_id").notNull(),
  quantity: numeric("quantity").notNull(),
  unitCost: numeric("unit_cost").notNull().default("0"),
  supplierId: integer("supplier_id"),
  receivedDate: date("received_date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const materialUsage = pgTable("material_usage", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  materialId: integer("material_id").notNull(),
  quantity: numeric("quantity").notNull(),
  usedDate: date("used_date").notNull(),
  phaseId: integer("phase_id"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const procurementRequests = pgTable("procurement_requests", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  supplierId: integer("supplier_id"),
  materialId: integer("material_id"),
  itemDescription: text("item_description").notNull(),
  quantity: numeric("quantity").notNull().default("0"),
  unit: text("unit"),
  status: text("status").notNull().default("draft"),
  neededBy: date("needed_by"),
  emailTo: text("email_to"),
  emailSubject: text("email_subject"),
  emailBody: text("email_body"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  role: text("role"),
  dailyRate: numeric("daily_rate").notNull().default("0"),
  phone: text("phone"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  workerId: integer("worker_id").notNull(),
  workDate: date("work_date").notNull(),
  present: boolean("present").notNull().default(true),
  hours: numeric("hours"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const consultants = pgTable("consultants", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  discipline: text("discipline"),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const consultantVisits = pgTable("consultant_visits", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  consultantId: integer("consultant_id").notNull(),
  visitDate: date("visit_date").notNull(),
  purpose: text("purpose"),
  findings: text("findings"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  type: text("type"),
  ownership: text("ownership").notNull().default("owned"),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const equipmentRentals = pgTable("equipment_rentals", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  dailyCost: numeric("daily_cost").notNull().default("0"),
  vendor: text("vendor"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull().default("0"),
  expenseDate: date("expense_date").notNull(),
  phaseId: integer("phase_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
