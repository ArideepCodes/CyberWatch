import type { Threat, ThreatExplanation, IPLookupResult, AnomalyAnalysis } from "@shared/schema";

export function generateThreatExplanation(threat: Threat): ThreatExplanation {
  const explanations: Record<string, string> = {
    "SQL Injection": `This SQL Injection attack from ${threat.ip} attempted to manipulate database queries through user input fields. The attacker tried to extract sensitive data or bypass authentication by injecting malicious SQL code. This is a critical security threat that could lead to data breaches, unauthorized access, and database manipulation.`,
    "DDoS Attack": `A Distributed Denial of Service (DDoS) attack was detected from ${threat.ip}. The attacker attempted to overwhelm the system with a flood of requests, making services unavailable to legitimate users. This attack could disrupt business operations and cause significant downtime.`,
    "Brute Force": `Brute force attack detected from ${threat.ip} involving systematic attempts to guess authentication credentials. The attacker used automated tools to try multiple username/password combinations, attempting to gain unauthorized access to the system.`,
    "Port Scanning": `Port scanning activity from ${threat.ip} indicates reconnaissance behavior. The attacker systematically probed network ports to identify open services and potential vulnerabilities. This is often a precursor to more sophisticated attacks.`,
    "Malware Distribution": `Malware distribution attempt from ${threat.ip} detected. The threat actor attempted to deliver malicious software that could compromise system integrity, steal data, or establish persistent access. Immediate isolation and removal are critical.`,
    "XSS Attack": `Cross-Site Scripting (XSS) attack from ${threat.ip} attempted to inject malicious scripts into web pages. This could allow attackers to steal user sessions, redirect users to malicious sites, or deface web content.`,
    "Data Exfiltration": `Data exfiltration detected from ${threat.ip}. Unusual outbound data transfers suggest unauthorized data theft. The attacker may have already compromised systems and is attempting to extract sensitive information.`,
    "Phishing Attempt": `Phishing campaign detected from ${threat.ip}. The attacker created fake login pages or sent deceptive messages to trick users into revealing credentials or sensitive information.`,
    "Unauthorized Access": `Unauthorized access attempt from ${threat.ip}. The threat actor tried to access restricted resources without proper authentication or authorization, potentially indicating a compromised account or insider threat.`,
    "API Abuse": `API abuse detected from ${threat.ip}. Excessive or malicious API requests suggest an attempt to exploit service endpoints, scrape data, or cause service degradation through rate limit violations.`,
    "Command Injection": `Command injection attack from ${threat.ip} attempted to execute arbitrary system commands through vulnerable application inputs. This critical vulnerability could lead to complete system compromise.`,
    "Session Hijacking": `Session hijacking attempt from ${threat.ip}. The attacker tried to steal or manipulate user session tokens to impersonate legitimate users and gain unauthorized access.`,
  };

  const defaultExplanation = `Security threat detected from ${threat.ip}. The attack type '${threat.type}' with ${threat.severity} severity requires immediate investigation. Based on geolocation data (${threat.country}), this appears to be part of a coordinated attack campaign targeting critical infrastructure.`;

  return {
    threat,
    explanation: explanations[threat.type] || defaultExplanation,
    impactRating: threat.score || calculateImpactScore(threat),
    responseSteps: generateResponseSteps(threat),
  };
}

export function generateImpactRating(threat: Threat): { rating: number; description: string } {
  const rating = threat.score || calculateImpactScore(threat);
  
  let description = "";
  
  if (rating >= 90) {
    description = `Critical impact detected. This ${threat.type} attack poses an immediate and severe risk to system integrity, data security, and business operations. Immediate incident response and system isolation are required. Potential for significant financial loss, regulatory penalties, and reputational damage.`;
  } else if (rating >= 75) {
    description = `High impact threat. The ${threat.type} attack from ${threat.country} presents substantial risk to security posture. Requires urgent attention and remediation within the next few hours to prevent escalation and potential data compromise.`;
  } else if (rating >= 50) {
    description = `Moderate impact level. While not immediately critical, this ${threat.type} activity should be addressed promptly. The threat could escalate if left unattended and may indicate reconnaissance for larger attacks.`;
  } else {
    description = `Low to moderate impact. This ${threat.type} represents a minor security concern but should still be logged and monitored. May be part of automated scanning rather than targeted attack, but vigilance is recommended.`;
  }

  return { rating, description };
}

export function suggestResponseSteps(threat: Threat): string[] {
  const baseSteps = [
    `Immediately block IP address ${threat.ip} at firewall and network perimeter`,
    `Review and analyze all logs for related activity from ${threat.country} region`,
    `Notify security operations center (SOC) and incident response team`,
  ];

  const severitySteps: Record<string, string[]> = {
    critical: [
      "Initiate emergency incident response protocol",
      "Isolate affected systems from network to prevent lateral movement",
      "Conduct immediate forensic analysis of compromised systems",
      "Preserve all evidence for potential legal action",
      "Notify executive leadership and prepare breach notification if required",
    ],
    high: [
      "Escalate to senior security team for immediate review",
      "Implement additional monitoring on affected systems",
      "Review and strengthen authentication mechanisms",
      "Conduct vulnerability scan on targeted systems",
    ],
    medium: [
      "Add IP to monitoring watchlist for 30 days",
      "Review security policies related to this threat vector",
      "Schedule security awareness training if social engineering involved",
    ],
    low: [
      "Document incident for trend analysis",
      "Update threat intelligence feeds",
      "Review automated security controls effectiveness",
    ],
  };

  const typeSteps: Record<string, string[]> = {
    "SQL Injection": [
      "Audit all database queries for proper input sanitization",
      "Implement prepared statements and parameterized queries",
      "Review web application firewall (WAF) rules",
    ],
    "DDoS Attack": [
      "Activate DDoS mitigation service if available",
      "Contact ISP for upstream filtering",
      "Implement rate limiting and traffic shaping",
    ],
    "Brute Force": [
      "Force password reset for targeted accounts",
      "Implement multi-factor authentication (MFA)",
      "Configure account lockout policies",
    ],
    "Malware Distribution": [
      "Run full anti-malware scan on all systems",
      "Check for indicators of compromise (IOCs)",
      "Restore from clean backups if necessary",
    ],
  };

  const allSteps = [
    ...baseSteps,
    ...(severitySteps[threat.severity.toLowerCase()] || severitySteps.low),
    ...(typeSteps[threat.type] || []),
  ];

  return allSteps.slice(0, 7);
}

export function detectAnomalies(threats: Threat[]): AnomalyAnalysis {
  const anomalies: string[] = [];
  
  // Check for unusual spike in threats
  const last24h = threats.filter(t => {
    const hoursSince = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60);
    return hoursSince <= 24;
  }).length;

  if (last24h > 10) {
    anomalies.push(`Unusual spike detected: ${last24h} threats in the last 24 hours (typical: 3-5)`);
  }

  // Check for repeated IPs
  const ipCounts = threats.reduce((acc, t) => {
    acc[t.ip] = (acc[t.ip] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(ipCounts).forEach(([ip, count]) => {
    if (count >= 3) {
      anomalies.push(`Repeated attacks from ${ip} (${count} incidents) - possible persistent threat actor`);
    }
  });

  // Check for geographic concentration
  const countryCounts = threats.reduce((acc, t) => {
    const country = t.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];
  if (topCountry && topCountry[1] > threats.length * 0.4) {
    anomalies.push(`Geographic concentration: ${topCountry[1]} threats from ${topCountry[0]} (${Math.round(topCountry[1] / threats.length * 100)}% of total)`);
  }

  // Check for critical severity spike
  const criticalCount = threats.filter(t => t.severity === "critical").length;
  if (criticalCount > threats.length * 0.3) {
    anomalies.push(`High proportion of critical threats: ${criticalCount}/${threats.length} (${Math.round(criticalCount / threats.length * 100)}%) - possible coordinated attack`);
  }

  // Check for diverse attack types (potential APT)
  const uniqueTypes = new Set(threats.map(t => t.type)).size;
  if (uniqueTypes >= 5 && threats.length >= 8) {
    anomalies.push(`Multiple attack vectors detected (${uniqueTypes} different types) - potential Advanced Persistent Threat (APT)`);
  }

  const confidence = Math.min(95, 60 + (anomalies.length * 10));

  return {
    detected: anomalies.length > 0,
    anomalies,
    confidence,
    recommendation: anomalies.length > 0 
      ? "Immediate security review recommended. Multiple anomalies suggest coordinated attack campaign."
      : "Threat patterns within normal parameters. Continue standard monitoring.",
  };
}

export function performIPLookup(ip: string): IPLookupResult {
  // Simulated IP lookup with realistic data
  const mockData: Record<string, Partial<IPLookupResult>> = {
    "192.168.1.105": {
      country: "Russia",
      isp: "Moscow Telecom",
      asn: "AS12345",
      riskScore: 95,
    },
    "45.142.212.67": {
      country: "China",
      isp: "China Unicom",
      asn: "AS4837",
      riskScore: 88,
    },
  };

  const data = mockData[ip] || {
    country: determineCountryFromIP(ip),
    isp: "Unknown ISP",
    asn: `AS${Math.floor(Math.random() * 90000) + 10000}`,
    riskScore: Math.floor(Math.random() * 60) + 30,
  };

  const aiSummary = generateIPSummary(ip, data.riskScore!, data.country!);

  return {
    ip,
    country: data.country!,
    isp: data.isp!,
    asn: data.asn!,
    riskScore: data.riskScore!,
    aiSummary,
  };
}

function calculateImpactScore(threat: Threat): number {
  const severityScores: Record<string, number> = {
    critical: 90,
    high: 75,
    medium: 50,
    low: 25,
  };

  const baseScore = severityScores[threat.severity.toLowerCase()] || 50;
  const randomVariance = Math.floor(Math.random() * 10) - 5;
  
  return Math.min(100, Math.max(0, baseScore + randomVariance));
}

function determineCountryFromIP(ip: string): string {
  const countries = ["United States", "China", "Russia", "Germany", "United Kingdom", "France", "Japan", "Brazil", "India", "Canada"];
  const firstOctet = parseInt(ip.split(".")[0]);
  return countries[firstOctet % countries.length];
}

function generateIPSummary(ip: string, riskScore: number, country: string): string {
  if (riskScore >= 80) {
    return `CRITICAL RISK: IP address ${ip} from ${country} has been flagged as high-risk based on threat intelligence databases. This IP has been associated with malicious activities including botnet operations, malware distribution, and coordinated attacks. Recommend immediate blocking and monitoring of all traffic from this source.`;
  } else if (riskScore >= 60) {
    return `HIGH RISK: IP address ${ip} originating from ${country} shows suspicious patterns. Multiple security incidents have been linked to this IP range. Exercise caution and implement additional authentication measures for requests from this source.`;
  } else if (riskScore >= 40) {
    return `MODERATE RISK: IP ${ip} from ${country} has some reputation concerns. While not definitively malicious, this IP has appeared in threat feeds and may be part of a shared hosting environment with compromised systems. Monitor closely.`;
  } else {
    return `LOW RISK: IP address ${ip} from ${country} appears relatively clean with no significant threat indicators. Normal security protocols should be sufficient, though continued monitoring is always recommended.`;
  }
}
