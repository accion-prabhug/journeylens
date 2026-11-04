import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  executeJourney,
  purchaseJourney,
  personas,
  generateReport,
} from '@journeylens/journey-engine';

import type {
  ExecutionResult,
  EvaluationReport,
} from '@journeylens/contracts';

@Injectable()
export class EvaluationsService {
  async runEvaluation() {
    const evaluationId = randomUUID();

    const executions: ExecutionResult[] = [];
    const reports: EvaluationReport[] = [];

    for (const persona of personas) {
      const execution = await executeJourney(
        purchaseJourney,
        evaluationId,
        persona.id,
      );

      executions.push(execution);

      const report = generateReport(execution, persona);

      reports.push(report);
    }

    return {
      id: evaluationId,
      websiteUrl: purchaseJourney.startUrl,
      journeyId: purchaseJourney.id,
      status: executions.every(
        (execution) => execution.status === 'completed',
      )
        ? 'completed'
        : 'failed',
      createdAt: new Date().toISOString(),
      executions,
      reports,
    };
  }
}