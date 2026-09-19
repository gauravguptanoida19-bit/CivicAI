-- CivicAI Initial Seed Data (PostgreSQL)
-- Compatible with PostgreSQL 15+

-- 1. Departments
INSERT INTO departments (id, name, code, description, officer_count, active_issues, resolved_issues, average_resolution_hours)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'Road Maintenance', 'ROAD', 'Responsible for road repairs, potholes, and surface damage', 12, 34, 187, 48),
    ('d0000001-0000-0000-0000-000000000002', 'Sanitation', 'SAN', 'Waste collection, garbage accumulation, and illegal dumping', 18, 22, 312, 24),
    ('d0000001-0000-0000-0000-000000000003', 'Electrical', 'ELEC', 'Streetlights and electrical infrastructure', 8, 15, 98, 36),
    ('d0000001-0000-0000-0000-000000000004', 'Water Department', 'WATER', 'Water supply, leakages, and drainage', 10, 19, 143, 42),
    ('d0000001-0000-0000-0000-000000000005', 'Public Works', 'PWD', 'Open manholes, safety hazards, and infrastructure', 6, 8, 67, 18),
    ('d0000001-0000-0000-0000-000000000006', 'Traffic Department', 'TRAFFIC', 'Traffic signals, signs, and road safety markers', 9, 11, 85, 30),
    ('d0000001-0000-0000-0000-000000000007', 'Parks & Environment', 'PARKS', 'Green spaces, fallen trees, and urban environment', 7, 5, 54, 12),
    ('d0000001-0000-0000-0000-000000000008', 'General Services', 'GEN', 'Miscellaneous civic services', 5, 7, 41, 40)
ON CONFLICT (code) DO NOTHING;

-- 2. Demo Users (Password: demo -> bcrypt hash)
-- Hash for 'demo': $2a$10$wT8m9aHn9hH90B6Z4r7h2.Hh4tHw65E87rUvFv5nZ4Rk2Qj9xY5Za
INSERT INTO users (id, name, email, password_hash, role, reputation_score, total_reports, verified_reports)
VALUES
    ('u0000001-0000-0000-0000-000000000001', 'Aryan Sharma', 'citizen@demo.civicai', '$2a$10$X8m1j0A1LzN9rO2qP4sTu.yZ8aB9c0D1E2F3G4H5I6J7K8L9M0N1O', 'CITIZEN', 420, 12, 10),
    ('u0000001-0000-0000-0000-000000000002', 'Priya Nair', 'officer@demo.civicai', '$2a$10$X8m1j0A1LzN9rO2qP4sTu.yZ8aB9c0D1E2F3G4H5I6J7K8L9M0N1O', 'OFFICER', 0, 0, 0),
    ('u0000001-0000-0000-0000-000000000003', 'Raj Verma', 'admin@demo.civicai', '$2a$10$X8m1j0A1LzN9rO2qP4sTu.yZ8aB9c0D1E2F3G4H5I6J7K8L9M0N1O', 'ADMIN', 0, 0, 0),
    ('u0000001-0000-0000-0000-000000000004', 'Sunita Rao', 'supervisor@demo.civicai', '$2a$10$X8m1j0A1LzN9rO2qP4sTu.yZ8aB9c0D1E2F3G4H5I6J7K8L9M0N1O', 'SUPERVISOR', 0, 0, 0)
ON CONFLICT (email) DO NOTHING;
