// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: APACHE-2.0

/**
 * IParser - Interface for natural language parser
 * 
 * This interface defines the necessary methods to interpret natural
 * language instructions and convert them into structured commands.
 */

export interface ParseResult {
  command: string;
  parameters: Record<string, any>;
  confidence: number;
  originalText: string;
}

export interface ValidationResult {
  isValid: boolean;
  missingParameters?: string[];
  invalidParameters?: Record<string, string>;
  suggestions?: string[];
  errorMessage?: string;
}

export interface IParser {
  /**
   * Parses a natural language instruction into a command structure
   * @param text Natural language instruction text
   * @returns Parsing result with extracted command and parameters
   */
  parseInstruction(text: string): Promise<ParseResult>;

  /**
   * Validates if an instruction has all required parameters
   * @param parseResult Parsing result to validate
   * @returns Validation result
   */
  validateInstruction(parseResult: ParseResult): Promise<ValidationResult>;

  /**
   * Normalizes parameters of a parsed instruction
   * @param parseResult Parsing result to normalize
   * @returns Parsing result with normalized parameters
   */
  normalizeParameters(parseResult: ParseResult): Promise<ParseResult>;

  /**
   * Generates suggestions to complete an incomplete instruction
   * @param partialText Partial instruction text
   * @returns List of suggestions to complete the instruction
   */
  suggestCompletions(partialText: string): Promise<string[]>;

  /**
   * Gets the list of commands supported by the parser
   * @returns List of supported commands with their descriptions
   */
  getSupportedCommands(): Promise<Array<{
    command: string;
    description: string;
    requiredParameters: string[];
    optionalParameters: string[];
  }>>;
}
