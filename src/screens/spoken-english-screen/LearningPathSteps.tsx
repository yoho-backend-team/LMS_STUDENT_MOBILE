
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import QuizModal from './QuizModal';

type Question = {
  title: string;
  options: { text: string; correct?: boolean }[];
  explanation: string;
};

type ChildItem = {
  childtitle: string;
  questions: Question[];
};

type Step = {
  id: number;
  steptitle: string;
  icon?: any;
  children: ChildItem[];
};

const steps: Step[] = [
  {
    id: 1,
    steptitle: 'Beginner',
    icon: require('../../assets/icons/beginner.png'),
    children: [
      { 
        childtitle: 'Professional Introduction',
        questions: [
          {
            title: "Which sentence is grammatically correct?",
            options: [
              { text: "He go to School Daily", correct: false },
              { text: "He goes to School Daily", correct: true },
              { text: "He going to School Daily", correct: false },
              { text: "He gone to School Daily", correct: false },
            ],
            explanation: "Third person singular (he/she/it) requires 's' or 'es' at the end of the verb in present tense.",
          },
          {
            title: "What is the correct way to introduce yourself professionally?",
            options: [
              { text: "Hey, I'm John", correct: false },
              { text: "Hello, my name is John Smith", correct: true },
              { text: "Hi, John here", correct: false },
              { text: "Yo, I'm John", correct: false },
            ],
            explanation: "A professional introduction should include a greeting and your full name.",
          },
          {
            title: "Which phrase is most appropriate for a professional setting?",
            options: [
              { text: "No problem", correct: false },
              { text: "You're welcome", correct: true },
              { text: "Yeah, sure", correct: false },
              { text: "Whatever", correct: false },
            ],
            explanation: "'You're welcome' is the most formal and professional response.",
          },
          {
            title: "What should you avoid in a professional introduction?",
            options: [
              { text: "Making eye contact", correct: false },
              { text: "Sharing too much personal information", correct: true },
              { text: "Using a firm handshake", correct: false },
              { text: "Smiling", correct: false },
            ],
            explanation: "Keep professional introductions focused on your role and relevant information.",
          },
          {
            title: "How should you end a professional introduction?",
            options: [
              { text: "Just walk away", correct: false },
              { text: "Say 'nice to meet you'", correct: true },
              { text: "Ask personal questions", correct: false },
              { text: "Start talking about your hobbies", correct: false },
            ],
            explanation: "End with a polite phrase like 'nice to meet you' or 'looking forward to working with you'.",
          }
        ]
      },
      { 
        childtitle: 'Career Goals',
        questions: [
          {
            title: "What is a SMART goal?",
            options: [
              { text: "A simple, manageable, achievable, realistic, timely goal", correct: false },
              { text: "Specific, measurable, achievable, relevant, time-bound goal", correct: true },
              { text: "Smart, meaningful, actionable, reasonable, targeted goal", correct: false },
              { text: "Strategic, manageable, actionable, realistic, timely goal", correct: false },
            ],
            explanation: "SMART stands for Specific, Measurable, Achievable, Relevant, and Time-bound.",
          },
          {
            title: "Why are career goals important?",
            options: [
              { text: "They help you get promotions faster", correct: false },
              { text: "They provide direction and motivation", correct: true },
              { text: "They impress your boss", correct: false },
              { text: "They guarantee success", correct: false },
            ],
            explanation: "Career goals give you direction and help you stay motivated and focused.",
          },
          {
            title: "How often should you review your career goals?",
            options: [
              { text: "Once a year", correct: false },
              { text: "Every 6-12 months", correct: true },
              { text: "Only when you change jobs", correct: false },
              { text: "Once every 5 years", correct: false },
            ],
            explanation: "Regular reviews (every 6-12 months) help keep your goals relevant.",
          },
          {
            title: "What should you consider when setting career goals?",
            options: [
              { text: "Only your current skills", correct: false },
              { text: "Your interests, values, skills, and market trends", correct: true },
              { text: "What your friends are doing", correct: false },
              { text: "Only the salary potential", correct: false },
            ],
            explanation: "Effective goals consider multiple factors including your interests and market conditions.",
          },
          {
            title: "Which is an example of a long-term career goal?",
            options: [
              { text: "Complete a training course this month", correct: false },
              { text: "Become a department head in 5 years", correct: true },
              { text: "Update your resume", correct: false },
              { text: "Network with 3 people this week", correct: false },
            ],
            explanation: "Long-term goals typically span 3-5 years or more.",
          }
        ]
      },
      { 
        childtitle: 'Skills & Strengths',
        questions: [
          {
            title: "What are hard skills?",
            options: [
              { text: "Personal attributes that help you work well with others", correct: false },
              { text: "Technical, teachable abilities specific to a job", correct: true },
              { text: "Skills that are difficult to learn", correct: false },
              { text: "Natural talents you're born with", correct: false },
            ],
            explanation: "Hard skills are technical, measurable abilities gained through training.",
          },
          {
            title: "Which is an example of a soft skill?",
            options: [
              { text: "Programming in Python", correct: false },
              { text: "Speaking a foreign language", correct: false },
              { text: "Communication", correct: true },
              { text: "Operating machinery", correct: false },
            ],
            explanation: "Soft skills are interpersonal skills like communication and teamwork.",
          },
          {
            title: "How can you identify your strengths?",
            options: [
              { text: "Ask for feedback from others", correct: false },
              { text: "Reflect on tasks you enjoy and do well", correct: false },
              { text: "Take assessments and analyze past successes", correct: false },
              { text: "All of the above", correct: true },
            ],
            explanation: "Multiple approaches help identify your true strengths.",
          },
          {
            title: "Why is it important to develop both hard and soft skills?",
            options: [
              { text: "Hard skills get you hired, soft skills get you promoted", correct: true },
              { text: "Soft skills are more important than hard skills", correct: false },
              { text: "Employers only care about hard skills", correct: false },
              { text: "Soft skills are easier to develop", correct: false },
            ],
            explanation: "Both skill types are valuable for career success.",
          },
          {
            title: "How can you improve your skills?",
            options: [
              { text: "Take courses and practice regularly", correct: true },
              { text: "Wait for natural improvement over time", correct: false },
              { text: "Only learn from mistakes", correct: false },
              { text: "Focus only on your strongest skills", correct: false },
            ],
            explanation: "Active learning and practice are key to skill development.",
          }
        ]
      },
      { 
        childtitle: 'Work Experience',
        questions: [
          {
            title: "How should you describe your work experience on a resume?",
            options: [
              { text: "List every task you ever performed", correct: false },
              { text: "Use action verbs and quantify achievements", correct: true },
              { text: "Write long paragraphs about each job", correct: false },
              { text: "Focus only on job titles and dates", correct: false },
            ],
            explanation: "Use action verbs and numbers to demonstrate impact.",
          },
          {
            title: "What is the most effective way to explain employment gaps?",
            options: [
              { text: "Lie about the dates", correct: false },
              { text: "Be honest and focus on skills gained during that time", correct: true },
              { text: "Avoid mentioning them", correct: false },
              { text: "Make excuses", correct: false },
            ],
            explanation: "Honesty and emphasis on relevant skills is the best approach.",
          },
          {
            title: "How far back should your work history go on a resume?",
            options: [
              { text: "10-15 years", correct: true },
              { text: "Your entire career history", correct: false },
              { text: "Only your current job", correct: false },
              { text: "Only the last 5 years", correct: false },
            ],
            explanation: "Typically, include 10-15 years of relevant experience.",
          },
          {
            title: "What should you include when describing work experience?",
            options: [
              { text: "Only job titles", correct: false },
              { text: "Responsibilities, achievements, and skills used", correct: true },
              { text: "Your salary at each position", correct: false },
              { text: "Reasons for leaving each job", correct: false },
            ],
            explanation: "Focus on responsibilities, achievements, and relevant skills.",
          },
          {
            title: "How can you make unrelated experience relevant?",
            options: [
              { text: "Focus on transferable skills", correct: true },
              { text: "Exaggerate your responsibilities", correct: false },
              { text: "Leave it off your resume", correct: false },
              { text: "Change job titles to sound more relevant", correct: false },
            ],
            explanation: "Highlight transferable skills that apply to the target role.",
          }
        ]
      },
    ],
  },
  {
    id: 2,
    steptitle: 'Intermediate',
    icon: require('../../assets/icons/intermadiate.png'),
    children: [
      { 
        childtitle: 'Project Experience',
        questions: [
          {
            title: "How should you describe project experience in an interview?",
            options: [
              { text: "Use the STAR method (Situation, Task, Action, Result)", correct: true },
              { text: "List all projects you've worked on", correct: false },
              { text: "Focus only on your personal contributions", correct: false },
              { text: "Use technical jargon to sound knowledgeable", correct: false },
            ],
            explanation: "The STAR method provides a structured way to explain projects.",
          },
          {
            title: "What information should you include about projects?",
            options: [
              { text: "Only the final outcome", correct: false },
              { text: "Your role, challenges, solutions, and results", correct: true },
              { text: "Every minor detail", correct: false },
              { text: "Only projects that were completely successful", correct: false },
            ],
            explanation: "Include your role, challenges, solutions, and measurable results.",
          },
          {
            title: "How do you handle questions about failed projects?",
            options: [
              { text: "Blame other team members", correct: false },
              { text: "Deny any projects ever failed", correct: false },
              { text: "Explain what you learned from the experience", correct: true },
              { text: "Change the subject quickly", correct: false },
            ],
            explanation: "Focus on lessons learned rather than failure.",
          },
          {
            title: "Why is project experience important to employers?",
            options: [
              { text: "It shows you can work independently", correct: false },
              { text: "It demonstrates practical application of skills", correct: true },
              { text: "It proves you're always busy", correct: false },
              { text: "It makes your resume longer", correct: false },
            ],
            explanation: "Project experience shows how you apply skills in real situations.",
          },
          {
            title: "How can you showcase project experience without professional projects?",
            options: [
              { text: "Include academic, personal, or volunteer projects", correct: true },
              { text: "Make up fictional projects", correct: false },
              { text: "Only list coursework", correct: false },
              { text: "Skip the projects section entirely", correct: false },
            ],
            explanation: "Academic, personal and volunteer projects all demonstrate skills.",
          }
        ]
      },
      { 
        childtitle: 'Certifications',
        questions: [
          {
            title: "Which certifications are most valuable?",
            options: [
              { text: "Those that are recognized industry-wide", correct: true },
              { text: "Certificates with the highest fees", correct: false },
              { text: "The easiest ones to obtain", correct: false },
              { text: "Certifications that never expire", correct: false },
            ],
            explanation: "Industry-recognized certifications hold the most value.",
          },
          {
            title: "How should you list certifications on a resume?",
            options: [
              { text: "In a dedicated certifications section", correct: true },
              { text: "Mixed in with work experience", correct: false },
              { text: "Only in the cover letter", correct: false },
              { text: "As footnotes", correct: false },
            ],
            explanation: "Create a separate section for certifications.",
          },
          {
            title: "What information should accompany each certification?",
            options: [
              { text: "Just the name", correct: false },
              { text: "Name, issuing organization, and date obtained", correct: true },
              { text: "The exam questions", correct: false },
              { text: "The cost of certification", correct: false },
            ],
            explanation: "Include the name, issuer, and date for each certification.",
          },
          {
            title: "Why pursue certifications?",
            options: [
              { text: "They guarantee a higher salary", correct: false },
              { text: "They demonstrate specialized knowledge and commitment", correct: true },
              { text: "They replace the need for a degree", correct: false },
              { text: "They're required for all jobs", correct: false },
            ],
            explanation: "Certifications show specialized knowledge and professional development.",
          },
          {
            title: "How do you maintain certifications?",
            options: [
              { text: "Ignore expiration dates", correct: false },
              { text: "Complete continuing education requirements", correct: true },
              { text: "Frame them and hang on the wall", correct: false },
              { text: "Take the exam again when needed", correct: false },
            ],
            explanation: "Most certifications require continuing education to maintain.",
          }
        ]
      },
    ],
  },
  {
    id: 3,
    steptitle: 'Advanced',
    icon: require('../../assets/icons/advance (1).png'),
    children: [
      { 
        childtitle: 'Leadership Skills',
        questions: [
          {
            title: "What is the most important leadership quality?",
            options: [
              { text: "Ability to command others", correct: false },
              { text: "Effective communication", correct: true },
              { text: "Making all decisions independently", correct: false },
              { text: "Never showing weakness", correct: false },
            ],
            explanation: "Communication is foundational to effective leadership.",
          },
          {
            title: "How do leaders build trust?",
            options: [
              { text: "By being perfect", correct: false },
              { text: "Through consistency, honesty, and competence", correct: true },
              { text: "By socializing outside work", correct: false },
              { text: "By demanding respect", correct: false },
            ],
            explanation: "Trust is built through consistent, honest behavior and demonstrated competence.",
          },
          {
            title: "What is situational leadership?",
            options: [
              { text: "Changing leadership style based on the situation", correct: true },
              { text: "Leading only in certain situations", correct: false },
              { text: "Letting situations dictate actions", correct: false },
              { text: "Leading from any position", correct: false },
            ],
            explanation: "Situational leadership adapts style to the specific context.",
          },
          {
            title: "How do effective leaders handle mistakes?",
            options: [
              { text: "Blame team members", correct: false },
              { text: "Take responsibility and focus on solutions", correct: true },
              { text: "Hide mistakes from superiors", correct: false },
              { text: "Punish those responsible", correct: false },
            ],
            explanation: "Leaders take responsibility and focus on learning and solutions.",
          },
          {
            title: "What is servant leadership?",
            options: [
              { text: "Putting the needs of others first", correct: true },
              { text: "Expecting others to serve you", correct: false },
              { text: "Leading through fear", correct: false },
              { text: "Micro-managing every task", correct: false },
            ],
            explanation: "Servant leadership focuses on supporting and empowering team members.",
          }
        ]
      },
      { 
        childtitle: 'Mentorship',
        questions: [
          {
            title: "What makes an effective mentor?",
            options: [
              { text: "Having all the answers", correct: false },
              { text: "Experience, empathy, and active listening", correct: true },
              { text: "Being older than the mentee", correct: false },
              { text: "Working in the same company", correct: false },
            ],
            explanation: "Effective mentors combine experience with empathy and listening skills.",
          },
          {
            title: "How should mentorship relationships be structured?",
            options: [
              { text: "With clear goals and expectations", correct: true },
              { text: "As completely informal interactions", correct: false },
              { text: "As a friendship without boundaries", correct: false },
              { text: "With the mentee directing all activities", correct: false },
            ],
            explanation: "Successful mentorship has clear goals and expectations.",
          },
          {
            title: "What is the primary benefit of having a mentor?",
            options: [
              { text: "Getting a higher salary", correct: false },
              { text: "Gaining wisdom from experienced guidance", correct: true },
              { text: "Having someone to do your work", correct: false },
              { text: "Building your social network", correct: false },
            ],
            explanation: "Mentors provide valuable guidance based on experience.",
          },
          {
            title: "How often should mentors and mentees meet?",
            options: [
              { text: "Daily", correct: false },
              { text: "Based on mutually agreed schedule", correct: true },
              { text: "Only when problems arise", correct: false },
              { text: "Once a year", correct: false },
            ],
            explanation: "Meeting frequency should work for both parties.",
          },
          {
            title: "What should mentees bring to mentorship sessions?",
            options: [
              { text: "Just themselves", correct: false },
              { text: "Specific questions and topics for discussion", correct: true },
              { text: "Gifts for the mentor", correct: false },
              { text: "Problems for the mentor to solve", correct: false },
            ],
            explanation: "Mentees should prepare specific topics to discuss.",
          }
        ]
      },
    ],
  },
  {
    id: 4,
    steptitle: 'Professional',
    icon : require('../../assets/icons/proffessional.png'),
    children: [
      { 
        childtitle: 'Industry Expert',
        questions: [
          {
            title: "How does one become an industry expert?",
            options: [
              { text: "By working in one field for many years", correct: false },
              { text: "Through continuous learning and contribution", correct: true },
              { text: "By claiming expert status", correct: false },
              { text: "By specializing in multiple industries", correct: false },
            ],
            explanation: "Becoming an expert requires continuous learning and contribution.",
          },
          {
            title: "What distinguishes an industry expert?",
            options: [
              { text: "Years of experience alone", correct: false },
              { text: "Deep knowledge and recognized authority", correct: true },
              { text: "Having a large social media following", correct: false },
              { text:"Working in a prestigious company", correct: false },
            ],
            explanation: "Experts have deep knowledge and are recognized as authorities.",
          },
          {
            title: "How do industry experts maintain their status?",
            options: [
              { text: "By staying current with trends and developments", correct: true },
              { text: "By protecting their knowledge", correct: false },
              { text: "By criticizing newcomers", correct: false },
              { text: "By repeating past successes", correct: false },
            ],
            explanation: "Experts continuously update their knowledge.",
          },
          {
            title: "What is the value of industry expertise?",
            options: [
              { text: "It commands higher consulting fees", correct: false },
              { text: "It provides insights that benefit organizations", correct: true },
              { text: "It guarantees job security", correct: false },
              { text: "It makes all decisions easy", correct: false },
            ],
            explanation: "Expertise provides valuable insights for decision-making.",
          },
          {
            title: "How should experts share their knowledge?",
            options: [
              { text: "Through teaching, writing, and mentoring", correct: true },
              { text: "By keeping it to themselves", correct: false },
              { text: "Only when paid to do so", correct: false },
              { text: "In highly technical language", correct: false },
            ],
            explanation: "Experts contribute to their field by sharing knowledge.",
          }
        ]
      },
    ],
  },
];

type LearningPathStepsProps = {
  onClose: () => void;
};

const LearningPathSteps: React.FC<LearningPathStepsProps> = ({ onClose }) => {
  const [expandedParent, setExpandedParent] = useState<number | null>(0);
  const [quizVisible, setQuizVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState<{
    stepIndex: number;
    childIndex: number;
    stepTitle: string;
    childTitle: string;
  } | null>(null);

  // Unlock state
  const [unlockedSections, setUnlockedSections] = useState<number[]>([0]); // only parent 0 unlocked
  const [unlockedChildren, setUnlockedChildren] = useState<{ [stepIndex: number]: number[] }>({
    0: [0], // only first child of first parent unlocked
  });
    const [scores, setScores] = useState<{ [key: string]: number }>({}); // { "Beginner": 85 }


  // Handle child click
  const handleChildPress = (
    stepIndex: number,
    stepTitle: string,
    child: any,
    childIndex: number
  ) => {
    const childUnlocked = unlockedChildren[stepIndex]?.includes(childIndex);
    if (!childUnlocked) {
      alert("This section is locked. Complete the previous section with 80%+ to unlock.");
      return;
    }

    setSelectedQuestions(child.questions);
    setActiveChild({ stepIndex, childIndex, stepTitle, childTitle: child.childtitle });
    setQuizVisible(true);
  };

  // Handle quiz complete
// Handle quiz complete
const handleQuizComplete = (scorePercent: number) => {
  if (activeChild) {
    const { stepIndex, childIndex, stepTitle } = activeChild;
    setScores(prev => ({ ...prev, [stepTitle]: scorePercent }));

    if (scorePercent >= 80) {
      setUnlockedChildren(prev => {
        const current = prev[stepIndex] || [];
        const updated = [...new Set([...current, childIndex + 1])];
        return {
          ...prev,
          [stepIndex]: updated
        };
      });

      // ✅ If last child of this step → unlock next step and its first child
      const isLastChild = childIndex === steps[stepIndex].children.length - 1;
      if (isLastChild && stepIndex < steps.length - 1) {
        setUnlockedSections(prev => [...new Set([...prev, stepIndex + 1])]);

        setUnlockedChildren(prev => ({
          ...prev,
          [stepIndex + 1]: [0], // unlock first child of next step
        }));
      }
    } else {
      alert("You need at least 80% to unlock the next section. Please retry!");
    }
  }

  setQuizVisible(false);
  setActiveChild(null);
};



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Path Steps</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>

      {/* Steps */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {steps?.map((step, index) => {
          const isActive = index === expandedParent;
          const isUnlocked = unlockedSections.includes(index);

          return (
            <View key={index} style={{ marginBottom: 16 }}>
              {/* Parent */}
              <TouchableOpacity
                disabled={!isUnlocked}
                onPress={() => setExpandedParent(isActive ? null : index)}
                activeOpacity={0.8}
              >
                {isUnlocked ? (
                  <LinearGradient
                    colors={["#a259ff", "#7209b7"]}
                    style={styles.activeStep}
                  >
                    {step.icon && (
                      <Image source={step.icon} style={[styles.icon, { tintColor: "#fff" }]} />
                    )}
                    <Text style={styles.activeText}>{step?.steptitle}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.inactiveStep, { opacity: 0.5 }]}>
                    {step.icon && (
                      <Image
                        source={step.icon}
                        style={[styles.icon, { tintColor: "#444" }]}
                      />
                    )}
                    <Text style={styles.inactiveText}>
                      {step?.steptitle} 🔒
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Children */}
              {isActive &&
                step.children &&
                isUnlocked &&
                step.children.map((child, childIndex) => {
                  const childUnlocked =
                    unlockedChildren[index]?.includes(childIndex);
                  return (
                    <TouchableOpacity
                      key={childIndex}
                      style={[
                        styles.childStep,
                        !childUnlocked && { opacity: 0.5 },
                      ]}
                      disabled={!childUnlocked}
                      onPress={() =>
                        handleChildPress(index, step?.steptitle, child, childIndex)
                      }
                    >
                      <Text style={styles.childText}>
                        • {child?.childtitle} {childUnlocked ? "🔓" : "🔒"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>

      {/* Quiz Modal */}
      <QuizModal
        visible={quizVisible}
        questions={selectedQuestions}
        onComplete={handleQuizComplete}
        onClose={() => setQuizVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  childStep: {
    marginLeft: 40,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  childText: {
    color: '#555',
    fontSize: 13,
  },
  activeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  activeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  inactiveText: {
    color: '#444',
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    color: '#fff',
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

export default LearningPathSteps;