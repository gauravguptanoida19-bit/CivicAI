-- CivicAI Initial Database Schema
-- Compatible with PostgreSQL 15+ and PostGIS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN',
    avatar TEXT,
    department_id UUID,
    reputation_score INT DEFAULT 0,
    total_reports INT DEFAULT 0,
    verified_reports INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    officer_count INT DEFAULT 0,
    active_issues INT DEFAULT 0,
    resolved_issues INT DEFAULT 0,
    average_resolution_hours INT DEFAULT 48,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Civic Issues Table
CREATE TABLE IF NOT EXISTS civic_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    address TEXT,
    ward VARCHAR(255),
    severity VARCHAR(50) NOT NULL,
    severity_score INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REPORTED',
    image_url TEXT,
    video_url TEXT,
    ai_analysis JSONB,
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    duplicate_of UUID REFERENCES civic_issues(id) ON DELETE SET NULL,
    duplicate_count INT DEFAULT 0,
    report_count INT DEFAULT 1,
    is_demo_data BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Spatial and Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_issues_geom ON civic_issues USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_issues_status ON civic_issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON civic_issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON civic_issues(ward);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON civic_issues(created_at DESC);
